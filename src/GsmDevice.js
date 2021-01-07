const { EOL } = require('os')
const EventEmitter = require('events')
const { constants: { OK, ERROR } } = require('./at')

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

    const payload = this._parseAndCleanResponse()

    if (this._hasPendingCallback(payload)) {
      this._resolveCallback(payload)
    } else {
      this._emitEvent(payload)
    }
  }

  _hasCommandTerminator() {
    return this.response.endsWith(OK)
        || this.response.endsWith(ERROR)
  }

  _parseAndCleanResponse() {
    const payload = this.response.trim().split('\r\n')
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
    this.emit('sms', payload)
  }
}

module.exports = GsmDevice