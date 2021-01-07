const expect = require('chai').expect
const sinon = require('sinon')
const EventEmitter = require('events')

const Sim = require('../../src/Sim')
const AtCommand = require('../../src/at/commands/ping')
const AtEvent = require('../../src/at/events/received-sms')
const events = Object.values(require('../../src/at/events'))

describe('Sim', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('#ping', () => {
    it('executes the command', () => {
      const fakeCommand = 'command'
      const fakeResponse = 'response'
      const fakeDevice = new EventEmitter()

      const stubCommand = sinon.stub(AtCommand, 'command').returns(fakeCommand)
      const stubHandler = sinon.stub(AtCommand, 'handle')
      fakeDevice.send = sinon.stub().resolves(fakeResponse)

      const sim = new Sim(fakeDevice)

      return sim.ping()
        .then(() => {
          expect(stubCommand.called).to.be.true;
          expect(fakeDevice.send.called).to.be.true;
          expect(stubHandler.calledWithExactly(fakeResponse)).to.be.true;
        })
        .catch(() => {
          assert.fail()
        })
    })
  })

  describe('#_onEvent', () => {
    it('found applicable event', () => {
      const stubHandler = sinon.stub(AtEvent, 'handle')

      const payload = ['+CMTI: "SM",6']
      const fakeDevice = new EventEmitter()
      const sim = new Sim(fakeDevice)

      fakeDevice.emit('event', payload)
      expect(stubHandler.calledWithExactly(['6'], [])).to.be.true
    })

    it('could not handle event', () => {
      const stubs = events.map((event) => sinon.stub(event, 'handle'))

      const payload = ['unknown event']
      const fakeDevice = new EventEmitter()
      const sim = new Sim(fakeDevice)

      fakeDevice.emit('event', payload)

      stubs.forEach((stub) => {
        expect(stub.called).to.be.false
      })
    })
  })
})