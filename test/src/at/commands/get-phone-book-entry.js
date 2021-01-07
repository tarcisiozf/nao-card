const { expect, assert } = require('chai')

const {
  commands: { GetPhonebookEntry }
} = require('../../../../src/at')

describe('AT/Command/GetPhonebookEntry', () => {
  describe('#command', () => {
    it('gets the command string', () => {
      expect(GetPhonebookEntry.command(1)).to.eq('AT+CPBR=1')
    })
  })

  describe('#handle', () => {
    it('ok', () => {
      const payload = ['+CPBR: 1,"5547988548837",129,"Meu Numero"', 'OK']

      return GetPhonebookEntry.handle(payload)
        .then((entry) => {
          expect(entry).to.be.eql({
            index: '1',
            number: '5547988548837',
            type: '129',
            text: 'Meu Numero',
          })
        })
        .catch((error) => {
          expect(error).to.be.undefined
        })
    })
  })
})