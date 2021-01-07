const { OK, ERROR } = require('../constants')

module.exports.command = () => {
  return 'AT'
}

module.exports.handle = (data) => {
  switch (data) {
    case OK:
      return Promise.resolve()
    case ERROR:
      return Promise.reject()
    default:
      return Promise.reject('Unknown status ' + data)
  }
}