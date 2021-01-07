const { OK, ERROR } = require('../../constants')

module.exports.assertStatus = (status) => {
  switch (status) {
    case OK:
      return Promise.resolve()
    case ERROR:
      return Promise.reject()
    default:
      return Promise.reject('Unknown status: ' + JSON.stringify(status, null, '\t'))
  }
}