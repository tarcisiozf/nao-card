module.exports.extract = (rx, input) => {
  const matches = rx.exec(input)
  return matches
    ? matches.slice(1)
    : null
}