const factory = require('./src/SimFactory')

const main = async () => {
  const sim = await factory.make('/dev/ttyUSB0')
  return sim.ping()
    .then(() => {
      return sim.enableTextMode()
    })
    .then(() => {
      return sim.readMessage(6)
    })
    .then(() => {
      return sim.deleteMessage(1)
    })
}

main()
  .then((results) => {
    console.log('END', results)
  })
  .catch(console.error)