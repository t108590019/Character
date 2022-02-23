pragma solidity ^0.8.0;

import "./ERC3664/ERC3664.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract Character is ERC3664, ERC721URIStorage{
    using Strings for uint256;

    uint256 private attrQuantity;
    string public baseExtension = ".json";
    string baseURI;

    constructor() ERC721("Item_nft", "ITEM") ERC3664("http://localhost:3000/"){
        attrQuantity = 3;
        _mint(0, 'attack', 'ATTACK', '');
        _mint(1, 'speed', 'SPEED', '');
        _mint(2, 'defense', 'DEFENSE', '');
        baseURI = "ipfs://QmWGWHDDSFTcct39YiaYg6cQ1Tmug4HEhA6a49ZLmhfujV/";
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

    function mint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
        //_setTokenURI(tokenId, _tokenURI);
    }

    function get_attributeAmount(uint256 tokenId, uint attrId) public view returns(uint256){
        return ERC3664.balanceOf(tokenId, attrId);
    }
    function get_attrName(uint256 attrId) public view returns(string memory){
        return ERC3664.name(attrId);
    }

    function _baseURI() internal view virtual override returns(string memory){
        return baseURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }
    function burnToken(uint256 tokenId) public{
        _burn(tokenId);
    }
}
