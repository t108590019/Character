const { assert } = require('chai')

const Character = artifacts.require('./Character.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  contract('Character', (accounts) => {
    let token
    let account = accounts[0]
  
    before(async () => {
      token = await Character.deployed()
    })
    describe('deployment', async () => {
      it('Deploys successfully', async () => {
        const address = token.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })

      it('Attr', async () => {
        let count = await token.getQuantity()
        assert.equal(count, 3)
        let name = await token.get_attrName(0)
        assert.equal(name, "attack")
      })

      it('Mint token', async () => {
        await token.mint(account, 0)
        let owner = await token.ownerOf(0)
        let balance = await token.balanceOf(account)
        assert.equal(owner, account)
        assert.equal(balance, 1)
      })

      it("Attach attr to token", async () => {
        await token.attach(0, 0, 2)  
        await token.attach(0, 1, 3)
        let types = await token.attributesOf(0)
        assert.equal(types[0], 0)
        assert.equal(types[1], 1)
      })

      it('ERC3664 balanceOf', async () => {
        let count0 = await token.get_attributeAmount(0, 0)
        assert.equal(count0, 2)
      })

      it('Token Metadata URI', async () => {
        let URI = await token.tokenURI(0)
        assert.equal("ipfs://QmWGWHDDSFTcct39YiaYg6cQ1Tmug4HEhA6a49ZLmhfujV/0.json", URI)
      })

      it('Burn Token', async () =>{
        //Mint tokenId 1
        await token.mint(account, 1)
        let owner = await token.ownerOf(0)
        let balance = await token.balanceOf(account)
        assert.equal(owner, account)
        assert.equal(balance, 2)

        //Burn tokenId 1
        await token.burnToken(1)
        balance = await token.balanceOf(account)
        assert.equal(balance, 1)
      })
  })
})
