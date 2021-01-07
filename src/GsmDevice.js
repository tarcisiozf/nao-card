const { EOL } = require('os')
const EventEmitter = require('events')

const MAX_BUFFER_SIZE = 32
const SEPARATOR = '\r\n'

class GsmDevice extends EventEmitter {
  constructor(port) {
    super()
    port.on('data', this._onData.bind(this))

    this.pending = {}
    this.response = ''
    this.port = port
  }

  send(command) {
    const pending = this.pending[command] || []

    return new Promise((resolve, reject) => {
      this.port.write(command + EOL, (err) => {
        if (err) {
          return reject(err)
        }

        this.pending[command] = pending.concat(resolve)
      })
    })
  }

  _onData(buffer) {
    this.response += buffer.toString()

    if (buffer.length === MAX_BUFFER_SIZE && !this.response.endsWith(SEPARATOR)) {
      return;
    }

    const payload = this._parseAndCleanResponse()

    if (this._hasPendingCallback(payload)) {
      this._resolveCallback(payload)
    } else {
      this._emitEvent(payload)
    }
  }

  _parseAndCleanResponse() {
    const payload = this.response.trim()
      .split(SEPARATOR)
      .filter(x => x.length > 0)

    this.response = ''

    return payload
  }

  _hasPendingCallback([command]) {
    return this.pending[command]
        && this.pending[command].length > 0
  }

  _resolveCallback([command, ...response]) {
    const callback = this.pending[command].shift()

    if (!response.length) {
      console.warn('Empty response', command)
      return callback()
    }

    callback(
      response.length > 1
        ? response
        : response.pop()
    )
  }

  _emitEvent(payload) {
    this.emit('event', payload)
  }
}

module.exports = GsmDevice