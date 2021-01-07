const { commands, events } = require('./at')

class Sim {
  constructor(device) {
    device.on('event', this._onEvent.bind(this))

    this.device = device
  }

  ping() {
    return this._sendCommand(commands.Ping)
  }

  enableTextMode() {
    return this._sendCommand(commands.SelectOperatingMode, commands.SelectOperatingMode.TEXT_MODE)
  }

  _sendCommand({ command, handle }, ...args) {
    return this.device.send(command.apply(null, args))
      .then((response) => {
        return handle(response)
      })
  }

  _onEvent([head, ...tail]) {
    for (const event of Object.values(events)) {
      const matches = event.pattern.exec(head)

      if (matches) {
        const args = matches.slice(1)
        return event.handle(this, args, tail)
      }
    }

    console.warn('Could not handle event:', head, tail)
  }
}

module.exports = Sim