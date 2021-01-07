module.exports.pattern = /\+CMTI: "SM",(\d+)/

module.exports.handle = (context, args, payload) => {
  console.log(context, args, payload)
}