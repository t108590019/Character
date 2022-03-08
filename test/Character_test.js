
const { assert, expect } = require('chai')

const Character = artifacts.require('./Character.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  contract('Character', (accounts) => {
    let token
    let account = accounts[0]
    let address=""
  
    before(async () => {
      token = await Character.deployed()
    })
    describe('deployment', async () => {
      it('Deploys successfully', async () => {
        address = token.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })

      it('Attr', async () => {
        let count = await token.getAttrQuantity()
        assert.equal(count, 3)
        let name = await token.getAttrName(0)
        assert.equal(name, "attack")
      })

      
      /*it('Mint token 1 in not sale', async () => { 
        assert.fail(await token.mint(account, 1), true);s
      })*/

      it('Mint token 0 in sales', async () => {
        await token.setSalesActive(true)
        await token.mint(account, 0)
        let owner = await token.ownerOf(0)
        let balance = await token.balanceOf(account)
        assert.equal(owner, account)
        assert.equal(balance, 1)

        let count0 = await token.getAttrAmount(0, 0)
        assert.equal(count0, 1)
      })


      it('Token Metadata URI in Not Reveal', async () => {
        let URI = await token.tokenURI(0)
        assert.equal("ipfs://QmY7iP9m5NYhvmqjgr7dmUSDiMndvDdwUHH9jMfeBkZUvH/unpack.json", URI)
      })

      it('Token Metadata URI in Reveal', async () => {
        await token.setReveal(true)
        let URI = await token.tokenURI(0)
        assert.equal("ipfs://QmY7iP9m5NYhvmqjgr7dmUSDiMndvDdwUHH9jMfeBkZUvH/0.json", URI)
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

        //Mint tokenId 1 again
        await token.mint(account, 1)
      })

      it('Seperate attr 0 from token 0', async () =>{
        await token.seperate(0, 0)
        assert.equal(await token.hasAttr(0, 0), false)
        assert.equal(await token.ownerOf(6), account)
      })

      it('Combine attr 0 with token 0', async () =>{
        await token.combine(0, 0)
        assert.equal(await token.hasAttr(0, 0), true)
        assert.equal(await token.ownerOf(6), address)
      })
  })
})
