const { expect, assert } = require('chai')
const sinon = require('sinon')

const {
  events: { ReceivedSms }
} = require('../../../../src/at')

describe('AT/Events/ReceivedSms', () => {
  const subscriber = sinon.stub()

  describe('#pattern', () => {
    it('gets the pattern regex', () => {
      expect(ReceivedSms.pattern).to.be.a('RegExp')
    })
  })

  describe('#subscribe', () => {
    it('subscribes a callback function', () => {
      try {
        ReceivedSms.subscribe(subscriber)
        assert.isOk(true)
      } catch (e) {
        assert.fail()
      }
    })
  })

  describe('#handle', () => {
    it('should keep working even if the message deletion fails', () => {
      const message = {
        body: 'body',
        messageStatus: 'REC READ',
        name: '',
        sender: '34p61627@6',
        timestamp: new Date(2021, 0, 5, 12, 24, 24)
      }
      const simMock = {
        readMessage: sinon.stub().resolves(message),
        deleteMessage: sinon.stub().rejects()
      }
      const index = 42
      const args = [index]

      return ReceivedSms.handle(simMock, args)
        .then(() => {
          expect(simMock.readMessage.calledWithExactly(index)).to.be.true
          expect(simMock.deleteMessage.called).to.be.true
          expect(subscriber.calledWithExactly(message)).to.be.true
        })
        .catch((error) => {
          expect(error).to.be.undefined
          assert.fail()
        })
    })
  })
})