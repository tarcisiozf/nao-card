const { expect, assert } = require('chai')
const sinon = require('sinon')

const {
  events: { ReceivedSms }
} = require('../../../../src/at')

describe('AT/Events/ReceivedSms', () => {
  describe('#pattern', () => {
    it('gets the pattern regex', () => {
      expect(ReceivedSms.pattern).to.be.a('RegExp')
    })
  })

  describe('#handle', () => {
    it('should keep working even if the message deletion fails', () => {
      const body = 'body'
      const message = {
        body,
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
        .then((result) => {
          expect(result).to.eq(body)
          expect(simMock.readMessage.calledWithExactly(index)).to.be.true
          expect(simMock.deleteMessage.called).to.be.true
        })
        .catch((error) => {
          expect(error).to.be.undefined
          assert.fail()
        })
    })
  })
})