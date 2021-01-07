const { expect, assert } = require('chai')
const sinon = require('sinon')
const EventEmitter = require('events')

const Sim = require('../../src/Sim')
const commands = require('../../src/at/commands')
const events = require('../../src/at/events')

describe('Sim', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('#ping', () => {
    it('executes the command', () => {
      const fakeCommand = 'command'
      const fakeResponse = 'response'
      const fakeDevice = new EventEmitter()

      const stubCommand = sinon.stub(commands.Ping, 'command').returns(fakeCommand)
      const stubHandler = sinon.stub(commands.Ping, 'handle')
      fakeDevice.send = sinon.stub().resolves(fakeResponse)

      const sim = new Sim(fakeDevice)

      return sim.ping()
        .then(() => {
          expect(stubCommand.called).to.be.true;
          expect(fakeDevice.send.called).to.be.true;
          expect(stubHandler.calledWithExactly(fakeResponse)).to.be.true;
        })
        .catch((err) => {
          expect(err).to.be.undefined
          assert.fail()
        })
    })
  })

  describe('#enableTextMode', () => {
    it('executes the command', () => {
      const fakeCommand = 'command'
      const fakeResponse = 'response'
      const fakeDevice = new EventEmitter()

      const stubCommand = sinon.stub(commands.SelectOperatingMode, 'command').returns(fakeCommand)
      const stubHandler = sinon.stub(commands.SelectOperatingMode, 'handle')
      fakeDevice.send = sinon.stub().resolves(fakeResponse)

      const sim = new Sim(fakeDevice)

      return sim.enableTextMode()
        .then(() => {
          expect(fakeDevice.send.called).to.be.true;
          expect(stubCommand.calledWithExactly(commands.SelectOperatingMode.TEXT_MODE)).to.be.true;
          expect(stubHandler.calledWithExactly(fakeResponse)).to.be.true;
        })
        .catch((err) => {
          expect(err).to.be.undefined
          assert.fail()
        })
    })
  })

  describe('#_onEvent', () => {
    it('found applicable event', () => {
      const stubHandler = sinon.stub(events.ReceivedSms, 'handle')

      const payload = ['+CMTI: "SM",6']
      const fakeDevice = new EventEmitter()
      const sim = new Sim(fakeDevice)

      fakeDevice.emit('event', payload)
      expect(stubHandler.calledWithExactly(sim, ['6'], [])).to.be.true
    })

    it('could not handle event', () => {
      const stubs = Object.values(events)
        .map((event) => sinon.stub(event, 'handle'))

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