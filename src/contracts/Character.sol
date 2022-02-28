pragma solidity ^0.8.0;

import "./ERC3664/extensions/ERC3664Updatable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract Character is ERC3664Updatable, ERC721URIStorage{
    using Strings for uint256;

    uint256 private totalSupply = 10;
    uint256 private attrQuantity;
    string public baseExtension = ".json";
    string public baseHeader = "ipfs://";
    string baseURI;

    constructor() ERC721("Item_nft", "ITEM") ERC3664("http://localhost:3000/"){
        attrQuantity = 3;
        _mint(0, 'attack', 'ATTACK', '');
        _mint(1, 'speed', 'SPEED', '');
        _mint(2, 'defense', 'DEFENSE', '');
        baseURI = "QmcM5RJeQdStzDqpyqVbSvWer3BSkyx8j1kypGpkwmbhLg/";
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

    function getAttrQuantity() external view returns(uint256){
        return attrQuantity;
    }

    function mint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
        _afterMintToken(tokenId);
    }

    function getAttrAmount(uint256 tokenId, uint attrId) public view returns(uint256){
        return ERC3664.balanceOf(tokenId, attrId);
    }
    function getAttrName(uint256 attrId) public view returns(string memory){
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
                        baseHeader,
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }
    function burnToken(uint256 tokenId) public {
        _burn(tokenId);
    }

    function hasAttr(uint256 tokenId, uint256 attrId) external view returns(bool){
        return  _hasAttr(tokenId, attrId);
    }

    function _afterMintToken(uint256 tokenId) internal {
        uint256 id = totalSupply + tokenId * 3;
        attach(tokenId, 0, 1);
        attach(tokenId, 1, 1);
        attach(tokenId, 2, 1);
        _mint(address(this), id + 0);
        _mint(address(this), id + 1);
        _mint(address(this), id + 2);
    }

    function seperate(uint256 tokenId, uint256 attrId) external {
        uint256 id = totalSupply + tokenId * 3;
        remove(tokenId, attrId);
        _transfer(address(this), ownerOf(tokenId), id + attrId);
    }

    function combine(uint256 tokenId, uint256 attrId) external {
        uint256 id = totalSupply + tokenId * 3;
        attach(tokenId, attrId, 1);
        _transfer( ownerOf(tokenId), address(this), id + attrId);
    }
}
