const { commands, events } = require('./at')
const regex = require('./utils/regex')

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

  readMessage(index) {
    return this._sendCommand(commands.ReadMessage, index)
  }

  deleteMessage(index) {
    return this._sendCommand(commands.DeleteMessage, index)
  }

  getPhonebookEntry(entry) {
    return this._sendCommand(commands.GetPhonebookEntry, entry)
  }

  _sendCommand({ command, handle }, ...args) {
    return this.device.send(command.apply(null, args))
      .then((response) => {
        return handle(response)
      })
  }

  _onEvent([head, ...tail]) {
    for (const event of Object.values(events)) {
      const matches = regex.extract(event.pattern, head)

      if (matches) {
        return event.handle(this, matches, tail)
      }
    }

    console.warn('Could not handle event:', head, tail)
  }
}

module.exports = Sim