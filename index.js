const factory = require('./src/SimFactory')

const main = async () => {
  const sim = await factory.make('/dev/ttyUSB0')
  return sim.ping()
    .then(() => {
      return sim.enableTextMode()
    })
}

main()
  .then(() => console.log('END'))
  .catch(console.error)