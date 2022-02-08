const { assert } = require('chai')

const Character = artifacts.require('./Character.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  contract('Character', (accounts) => {
    let token
  
    before(async () => {
      token = await Character.deployed()
    })
    describe('deployment', async () => {
      it('deploys successfully', async () => {
        const address = token.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })

      it("Mint attr", async () => {
        await token.mint(0, "Hat", "equip", "uri");
        await token.mint(1, "Sword", "equip", "uri");
        await token.mint(6, "Boots", "equip", "uri")
        const attr0_name = await token.name(0);
        const attr0_symbol = await token.symbol(0);
        const attr1_name = await token.name(1);
        const attr1_symbol = await token.symbol(1);
        assert.equal(attr0_name, "Hat")
        assert.equal(attr0_symbol, "equip")
        assert.equal(attr1_name, "Sword")
        assert.equal(attr1_symbol, "equip")
      })

      it("Attach attr to token", async () => {
        //attach 2 Hat and 3 Sword attribute to "tokenId" 0
        await token.attach(0, 0, 2)  
        await token.attach(0, 1, 3)
        await token.attach(0, 6, 1)
        const countAttr0 = await token.balanceOf(0, 0)
        const countAttr1 = await token.balanceOf(0, 1)
        const types = await token.attributesOf(0)
        assert.equal(countAttr0, 2)
        assert.equal(countAttr1, 3)
        assert.equal(types[0], 0)
        assert.equal(types[1], 1)
        assert.equal(types[2], 6)
      })

  })
})
