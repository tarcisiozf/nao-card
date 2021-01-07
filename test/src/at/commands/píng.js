const { expect, assert } = require('chai')

const {
  constants: { OK, ERROR },
  commands: { Ping }
} = require('../../../../src/at')

describe('AT/Command/Ping', () => {
  describe('#command', () => {
    it('gets the command string', () => {
      expect(Ping.command()).to.eq('AT')
    })
  })

  describe('#handle', () => {
    it('ok', () => {
      return Ping.handle(OK)
        .then(() => {
          assert.isOk(true)
        })
        .catch((error) => {
          expect(error).to.be.undefined
        })
    })

    it('error', () => {
      return Ping.handle(ERROR)
        .then(() => {
          assert.fail()
        })
        .catch((error) => {
          expect(error).to.be.undefined
        })
    })

    it('unknown', () => {
      return Ping.handle('foo')
        .then(() => {
          assert.fail()
        })
        .catch((error) => {
          expect(error).to.eq('Unknown status: "foo"')
        })
    })
  })
})