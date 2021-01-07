const { EOL } = require('os')
const { constants: { OK, ERROR } } = require('./at')

class GsmDevice {
  constructor(port) {
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
    this.response += buffer.toString().trim()

    if (this._hasCommandTerminator()) {
      const [command, ...response] = this._parseAndCleanResponse()

      if (this._hasPendingCallback(command)) {
        this._resolveCallback(command, response)
      } else {
        this._emitEvent(command, response)
      }
    }
  }

  _hasCommandTerminator() {
    return this.response.endsWith(OK)
        || this.response.endsWith(ERROR)
  }

  _parseAndCleanResponse() {
    const payload = this.response.split('\r\n')
    this.response = ''

    return payload
  }

  _hasPendingCallback(command) {
    return this.pending[command]
        && this.pending[command].length > 0
  }

  _resolveCallback(command, response) {
    const callback = this.pending[command].shift()

    if (!response.length) {
      return callback(command)
    }

    callback(
      response.length > 1
        ? response
        : response.pop()
    )
  }

  _emitEvent(command, response) {

  }
}

module.exports = GsmDevice