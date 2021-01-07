const { assertStatus } = require('./utils/assertions')

module.exports.command = () => {
  return 'AT'
}

module.exports.handle = assertStatus