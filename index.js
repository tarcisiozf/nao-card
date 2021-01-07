const factory = require('./src/SimFactory')
const { events } = require('./src/at')

const onReceiveSms = (message) => {
  console.log(message)
}

const main = async () => {
  events.ReceivedSms.subscribe(onReceiveSms)

  const sim = await factory.make('/dev/ttyUSB0')
  return sim.ping()
    .then(() => {
      return sim.enableTextMode()
    })
    .then(() => {
      return sim.getPhonebookEntry(1)
    })
}

main()
  .then((results) => {
    console.log('END', results)
  })
  .catch(console.error)