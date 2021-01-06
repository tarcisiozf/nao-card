const Serialport = require('serialport')
const GsmDevice = require('./GsmDevice')
const Sim = require('./Sim')

module.exports.make = (path, baudRate = 9600) => {
  return new Promise((resolve, reject) => {
    const port = new Serialport(path, { baudRate }, (error) => {
      if (error) reject(error)
    })

    port.on('error', (error) => {
      reject(error)
    })

    port.on('open', () => {
      const device = new GsmDevice(port)
      resolve(new Sim(device))
    })
  })
}