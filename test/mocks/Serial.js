const EventEmitter = require('events')

const MAX_BUFFER_SIZE = 32

class Serial extends EventEmitter {
  constructor(props = {}) {
    super();
    Object.assign(this, props)
  }

  fakeDataEvent(data) {
    const n = Math.ceil(data.length / MAX_BUFFER_SIZE)

    for (let i = 0; i < n; i++) {
      const start = i * MAX_BUFFER_SIZE
      const offset = start + MAX_BUFFER_SIZE
      const chunk = data.slice(start, offset)

      this.emit('data', Buffer.from(chunk))
    }
  }
}

module.exports = Serial