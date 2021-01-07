const { assertStatus } = require('./utils/assertions')

module.exports.command = (index) => {
  return `AT+CMGD=${index}`
}

module.exports.handle = assertStatus