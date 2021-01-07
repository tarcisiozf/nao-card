module.exports.pattern = /\+CMTI: "SM",(\d+)/

module.exports.handle = (args, payload) => {
  console.log(args, payload)
}