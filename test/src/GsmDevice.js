const expect = require('chai').expect
const sinon = require('sinon')

const SerialMock = require('../mocks/Serial')
const GsmDevice = require('../../src/GsmDevice')
const { constants: { SEPARATOR } } = require('../../src/at')

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
      const fakeCommand = 'AT+CMGL="ALL"'
      const fakeData = [
        'AT+CMGL="ALL"',
        '+CMGL: 1,"REC READ","34p61627@',
        '6","","21/01/05,12:24:24-12"',
        'Fa',
        'ca recargas quando quiser com mu',
        'ito mais facilidade e agilidade',
        'pelo Minha Claro no WhatsApp. Ad',
        'icione o numero (11) 9999-10621',
        'ou acesse clarobr.co/WPP14',
        'OK'
      ].join(SEPARATOR)

      const device = new GsmDevice(serialMock)

      const promise = device.send(fakeCommand)
      const [command, cb] = serialMock.write.getCall(0).args
      expect(command).to.eql(fakeCommand + '\n')
      cb(null)

      serialMock.fakeDataEvent(fakeData)
      const result = await promise

      expect(result).to.eql( [
        '+CMGL: 1,"REC READ","34p61627@',
        '6","","21/01/05,12:24:24-12"',
        'Fa',
        'ca recargas quando quiser com mu',
        'ito mais facilidade e agilidade',
        'pelo Minha Claro no WhatsApp. Ad',
        'icione o numero (11) 9999-10621',
        'ou acesseclarobr.co/WPP14',
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