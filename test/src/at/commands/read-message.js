const { expect, assert } = require('chai')

const {
  commands: { ReadMessage }
} = require('../../../../src/at')

describe('AT/Command/ReadMessage', () => {
  describe('#command', () => {
    it('gets the command string', () => {
      expect(ReadMessage.command(1)).to.eq('AT+CMGR=1')
    })
  })

  describe('#handle', () => {
    it('ok', () => {
      const header = '+CMGL: 1,"REC READ","34p61627@6","","21/01/05,12:24:24-12"'
      const body = 'Faca recargas quando quiser com muito mais facilidade e agilidade pelo Minha Claro no WhatsApp. Adicione o numero (11) 9999-10621 ou acesse clarobr.co/WPP14'
      const commandStatus = 'OK'
      const payload = [header, body, commandStatus]

      return ReadMessage.handle(payload)
        .then((message) => {
          expect(message).to.eql({
            body,
            index: '1',
            messageStatus: 'REC READ',
            name: '',
            sender: '34p61627@6',
            timestamp: new Date(2021, 0, 5, 12, 24, 24)
          })
        })
    })
  })
})