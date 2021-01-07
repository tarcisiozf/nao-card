const { assertStatus } = require('./utils/assertions')

module.exports.TEXT_MODE = 1
module.exports.SMS_PDU = 0

module.exports.command = (mode) => {
  return `AT+CMGF=${mode}`
}

module.exports.handle = assertStatus