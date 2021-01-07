const expect = require('chai').expect
const sinon = require('sinon')
const EventEmitter = require('events')

const Sim = require('../../src/Sim')
const AtEvent = require('../../src/at/events/received-sms')

describe('Sim', () => {

  describe('#_onEvent', () => {
    const fakeDevice = new EventEmitter()
    const sim = new Sim(fakeDevice)

    fakeDevice.emit('event', ['+CMTI: "SM",6'])
  })
})