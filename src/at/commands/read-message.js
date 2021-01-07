const { assertStatus } = require('./utils/assertions')
const regex = require('../../utils/regex')

const rxHeader = /\+CMGL:\s+(\d+),"([^"]+)","([^"]+)",(?:"([^"]*)")?,"([^"]+)"/
const rxTimestamp = /(\d+\/\d+\/\d+),(\d+:\d+:\d+)(-?\d+)/

const QUARTER_OF_AN_HOUR = 4

const parseTimestamp = (timestamp) => {
  const matches = regex.extract(rxTimestamp, timestamp)
  if (!matches) return null

  const [date, time, timezone] = matches
  const zoneUnits = Number(timezone) / QUARTER_OF_AN_HOUR
  const timeZoneDesignator = zoneUnits > 0
    ? `UTC+${zoneUnits}`
    : `UTC${zoneUnits}`

  return new Date(`20${date} ${time} ${timeZoneDesignator}`)
}

module.exports.command = (index) => {
  return `AT+CMGR=${index}`
}

module.exports.handle = ([header, body, commandStatus]) => {
    return assertStatus(commandStatus)
    .then(() => {
      const matches = regex.extract(rxHeader, header)
      if (!matches) {
        return Promise.reject(`Failed to parse message header: "${header}"`)
      }

      return matches
    })
    .then(([index, messageStatus, sender, name, timestamp]) => {
      return {
        index,
        messageStatus,
        sender,
        name,
        timestamp: parseTimestamp(timestamp),
        body
      }
    })
}