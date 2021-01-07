const expect = require('chai').expect
const sinon = require('sinon')
const EventEmitter = require('events')

const GsmDevice = require('../src/GsmDevice')

const hexArrayToBuffer = (arr) => {
  const len = arr.length
  const byteArray = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    byteArray[i] = arr[i]
  }

  return Buffer.from(byteArray)
}

/*
<Buffer 41 54 0d 0a 4f 4b 0d 0a>
AT
OK

[ 'AT', 'OK' ]
<Buffer 0d 0a 2b 43 4d 54 49 3a 20 22 53 4d 22 2c 36 0d 0a>

+CMTI: "SM",6

[ '+CMTI: "SM",6' ]
<Buffer 0d 0a 2b 43 4d 54 49 3a 20 22 53 4d 22 2c 37 0d 0a>

 */

describe('GsmDevice', () => {
  describe('#send', () => {
    it('should get answer', async () => {
      const serialMock = new EventEmitter()
      serialMock.write = sinon.stub()
      const fakeCommand = 'AT'
      const answer = 'OK'

      const device = new GsmDevice(serialMock)

      const promise = device.send(fakeCommand)
      const [command, cb] = serialMock.write.getCall(0).args
      expect(command).to.eq('AT\n')
      cb(null)

      serialMock.emit('data', hexArrayToBuffer([0x41, 0x54, 0x0d, 0x0a, 0x4f, 0x4b, 0x0d, 0x0a]))
      const result = await promise

      expect(result).to.eq(answer)
    })

    it('should return the error', () => {
      const fakeCommand = 'fake command'
      const fakeErr = new Error('fails for some reason');
      const serialMock = new EventEmitter()
      serialMock.write = (command, cb) => {
        expect(command).to.eq('fake command\n')
        cb(fakeErr)
      }

      const device = new GsmDevice(serialMock)

      return device.send(fakeCommand)
        .catch((err) => {
          expect(err).to.eq(fakeErr)
        })
    })
  })
})