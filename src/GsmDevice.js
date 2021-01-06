
class GsmDevice {
  constructor(port) {
    port.on('data', this._onData.bind(this))

    this.pending = []
    this.port = port
  }

  send(command) {
    return new Promise((resolve, reject) => {
      this.port.write(command, (err) => {
        if (err) {
          return reject(err)
        }

        this.pending.push(resolve)
      })
    })
  }

  _onData(buffer) {
    const payload = buffer.toString('ascii')
    const cb = this.pending.shift()
    cb(payload)
  }
}

module.exports = GsmDevice