const { EOL } = require('os')
const EventEmitter = require('events')
const { constants: { OK, ERROR, SEPARATOR } } = require('./at')

class GsmDevice extends EventEmitter {
  constructor(port) {
    super()
    port.on('data', this._onData.bind(this))

    this.callback = null
    this.response = []
    this.port = port
  }

  send(command) {
    if (this.callback) {
      return Promise.reject()
    }

    return new Promise((resolve, reject) => {
      this.port.write(command + EOL, (err) => {
        if (err) {
          return reject(err)
        }

        this.callback = resolve
      })
    })
  }

  _onData(buffer) {
    this.response.push(buffer.toString())

    if (!this.callback) {
      const payload = this._parseAndCleanResponse()
      this._emitEvent(payload)
      return;
    }

    if (!this._hasTerminationStatus()) {
      return;
    }

    const payload = this._parseAndCleanResponse()
    this._resolveCallback(payload)
  }

  _hasTerminationStatus() {
    const lastChunk = this.response[this.response.length - 1].trim()
    return lastChunk.endsWith(OK)
        || lastChunk.endsWith(ERROR)
  }

  _parseAndCleanResponse() {
    const payload = this.response
      .join('')
      .split(SEPARATOR)
      .filter(x => x.length > 0)

    this.response = ''

    return payload
  }

  _resolveCallback([, ...response]) {
    this.callback(
      response.length > 1
        ? response
        : response.pop()
    )
    this.callback = null
  }

  _emitEvent(payload) {
    this.emit('event', payload)
  }
}

module.exports = GsmDevice