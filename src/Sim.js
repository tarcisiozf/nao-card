const { commands } = require('./at')

class Sim {
  constructor(device) {
    this.device = device
  }

  ping() {
    return this._sendCommand(commands.Ping)
  }

  _sendCommand(at) {
    return this.device.send(at.command())
      .then((response) => {
        return at.handle(response)
      })
  }
}

module.exports = Sim