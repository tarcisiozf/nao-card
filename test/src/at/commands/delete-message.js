const { expect, assert } = require('chai')

const {
  constants: { OK, ERROR },
  commands: { DeleteMessage }
} = require('../../../../src/at')

describe('AT/Command/DeleteMessage', () => {
  describe('#command', () => {
    it('gets the command string', () => {
      expect(DeleteMessage.command(10)).to.eq('AT+CMGD=10')
    })
  })

  describe('#handle', () => {
    it('ok', () => {
      return DeleteMessage.handle(OK)
        .then(() => {
          assert.isOk(true)
        })
        .catch((error) => {
          expect(error).to.be.undefined
        })
    })

    it('error', () => {
      return DeleteMessage.handle(ERROR)
        .then(() => {
          assert.fail()
        })
        .catch((error) => {
          expect(error).to.be.undefined
        })
    })

    it('unknown', () => {
      return DeleteMessage.handle('foo')
        .then(() => {
          assert.fail()
        })
        .catch((error) => {
          expect(error).to.eq('Unknown status: "foo"')
        })
    })
  })
})