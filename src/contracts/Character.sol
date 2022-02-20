pragma solidity ^0.8.0;

import "./ERC3664/ERC3664.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract Character is ERC3664, ERC721URIStorage{

    uint256 private attrQuantity;

    constructor() ERC721("Item_nft", "ITEM") ERC3664("http://localhost:3000/"){
        attrQuantity = 3;
        _mint(0, 'attack', 'ATTACK', '');
        _mint(1, 'speed', 'SPEED', '');
        _mint(2, 'defense', 'DEFENSE', '');
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC3664, ERC721)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getQuantity() external view returns(uint256){
        return attrQuantity;
    }

    function mint(address to, uint256 tokenId, string memory _tokenURI) public {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    function get_attributeAmount(uint256 tokenId, uint attrId) public view returns(uint256){
        return ERC3664.balanceOf(tokenId, attrId);
    }
    function get_attrName(uint256 attrId) public view returns(string memory){
        return ERC3664.name(attrId);
    }
}
