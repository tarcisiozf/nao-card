const { assertStatus } = require('./utils/assertions')
const regex = require('../../utils/regex')

const rxHeader = /\+CPBR: (\d+),"(\d+)",(\d+),"([^"]+)"/

module.exports.command = (entry) => {
  return `AT+CPBR=${entry}`
}

module.exports.handle = ([header, status]) => {
  const matches = regex.extract(rxHeader, header)

  if (!matches) {
    return Promise.reject()
  }

  return assertStatus(status)
    .then(() => {
      const [entry, sender, type, title] = matches

      return {
        entry,
        sender,
        type,
        title
      }
    })
}