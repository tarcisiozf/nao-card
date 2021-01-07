const factory = require('./src/SimFactory')

const main = async () => {
  const sim = await factory.make('/dev/ttyUSB0')
  await sim.ping()
}

main()
  .then(() => console.log('END'))
  .catch(console.error)