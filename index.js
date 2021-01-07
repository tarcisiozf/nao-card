const factory = require('./src/SimFactory')

const main = async () => {
  const sim = await factory.make('/dev/ttyUSB0')
  return sim.ping()
    .then(() => {
      return sim.enableTextMode()
    })
    .then(() => {
      return sim.readMessage(1)
    })
}

main()
  .then(() => console.log('END'))
  .catch(console.error)