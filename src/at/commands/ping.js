module.exports.command = () => {
  return 'AT'
}

module.exports.response = (data) => {
  switch (data) {
    case 'OK':
      return Promise.resolve()
    case 'ERROR':
      return Promise.reject()
    default:
      return Promise.reject('Unknown status ' + data)
  }
}