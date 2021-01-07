const { assertStatus } = require('./utils/assertions')
const regex = require('../../utils/regex')

const rxHeader = /\+CPBR: (\d+),"(\d+)",(\d+),"([^"]+)"/

module.exports.command = (index) => {
  return `AT+CPBR=${index}`
}

module.exports.handle = ([header, status]) => {
  const matches = regex.extract(rxHeader, header)

  if (!matches) {
    return Promise.reject()
  }

  return assertStatus(status)
    .then(() => {
      const [index, number, type, text] = matches

      return {
        index,
        number,
        type,
        text
      }
    })
}