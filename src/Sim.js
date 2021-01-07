const { commands, events } = require('./at')

class Sim {
  constructor(device) {
    device.on('event', this._onEvent.bind(this))

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

  _onEvent([head, ...tail]) {
    for (const event of Object.values(events)) {
      const matches = event.pattern.exec(head)

      if (matches) {
        const args = matches.slice(1)
        return event.handle(args, tail)
      }
    }

    console.warn('Could not handle event:', head, tail)
  }
}

module.exports = Sim