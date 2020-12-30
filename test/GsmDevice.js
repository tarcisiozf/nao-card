const expect = require('chai').expect
const sinon = require('sinon')
const EventEmitter = require('events')

const GsmDevice = require('../src/GsmDevice')

describe('GsmDevice', () => {
  describe('#send', () => {
    it('should get answer', async () => {
      const serialMock = new EventEmitter()
      serialMock.write = sinon.stub()
      const fakeCommand = 'fake command'
      const answer = 'hello, world!'

      const device = new GsmDevice(serialMock)

      const promise = device.send(fakeCommand)
      const [command, cb] = serialMock.write.getCall(0).args
      expect(command).to.eq(fakeCommand)
      cb(null)

      serialMock.emit('data', Buffer.from(answer))
      const result = await promise

      expect(result).to.eq(answer)
    })

    it('should return the error', () => {
      const fakeCommand = 'fake command'
      const fakeErr = new Error('fails for some reason');
      const serialMock = new EventEmitter()
      serialMock.write = (command, cb) => {
        expect(command).to.eq(fakeCommand)
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