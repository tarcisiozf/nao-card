const subscribers = []

module.exports.pattern = /\+CMTI: "SM",(\d+)/

module.exports.subscribe = (callback) => {
  subscribers.push(callback)
}

module.exports.handle = (sim, [index]) => {
  return sim.readMessage(index)
    .then((message) => {
      return sim.deleteMessage(index)
        .then(() => message)
        .catch((err) => {
          console.warn('failed to delete message', err)
          return message
        })
    })
    .then((message) => {
      subscribers.forEach(cb => cb(message))
    })
}