const expect = require('chai').expect
const sinon = require('sinon')

const SerialMock = require('../mocks/Serial')
const GsmDevice = require('../../src/GsmDevice')

describe('GsmDevice', () => {
  describe('#send', () => {
    it('simple command and answer', async () => {
      const serialMock = new SerialMock({
        write: sinon.stub()
      })
      const fakeCommand = 'AT'
      const answer = 'OK'

      const device = new GsmDevice(serialMock)

      const promise = device.send(fakeCommand)
      const [command, cb] = serialMock.write.getCall(0).args
      expect(command).to.eq('AT\n')
      cb(null)

      serialMock.fakeDataEvent('AT\r\nOK\r\n')
      const result = await promise

      expect(result).to.eq(answer)
    })

    it('failed to write', () => {
      const fakeCommand = 'fake command'
      const fakeErr = new Error('fails for some reason');
      const stubWrite = (command, cb) => {
        expect(command).to.eq('fake command\n')
        cb(fakeErr)
      }

      const serialMock = new SerialMock({
        write: stubWrite
      })

      const device = new GsmDevice(serialMock)

      return device.send(fakeCommand)
        .catch((err) => {
          expect(err).to.eq(fakeErr)
        })
    })

    it('handle multiple buffers', async () => {
      const serialMock = new SerialMock({
        write: sinon.stub()
      })
      const fakeCommand = 'AT+CMGL'
      const fakeData = '\r\nAT+CMGL'
        + '\r\n+CMGL: 6,0,"",22'
        + '\r\n0791550005114450240D91551499829587F200001210601213332902D53A'
        + '\r\n\r\n+CMGL: 7,0,"",24'
        + '\r\n0791550005114450240D91551499829587F200081210601213742904D83EDD11'
        + '\r\n\r\nOK\r\n'

      const device = new GsmDevice(serialMock)

      const promise = device.send(fakeCommand)
      const [command, cb] = serialMock.write.getCall(0).args
      expect(command).to.eql('AT+CMGL\n')
      cb(null)

      serialMock.fakeDataEvent(fakeData)
      const result = await promise

      expect(result).to.eql([
        '+CMGL: 6,0,"",22',
        '0791550005114450240D91551499829587F200001210601213332902D53A',
        '+CMGL: 7,0,"",24',
        '0791550005114450240D91551499829587F200081210601213742904D83EDD11',
        'OK'
      ])
    })
  })

  describe('Events', () => {
    it('simple event', (done) => {
      const serialMock = new SerialMock()
      const device = new GsmDevice(serialMock)

      device.on('event', (data) => {
        expect(data).to.eql(['+CMTI: "SM",6'])
        done()
      })

      serialMock.fakeDataEvent('\r\n+CMTI: "SM",6\r\n')
    })
  })
})