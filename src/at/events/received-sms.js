module.exports.pattern = /\+CMTI: "SM",(\d+)/

module.exports.handle = (sim, [index]) => {
  return sim.readMessage(index)
    .then((message) => {
      return message.body
    })
    .then((body) => {
      return sim.deleteMessage(index)
        .then(() => body)
        .catch((err) => {
          console.warn('failed to delete message', err)
          return body
        })
    })
}