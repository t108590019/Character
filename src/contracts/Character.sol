pragma solidity ^0.8.0;

import "./ERC3664/extensions/ERC3664Updatable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";


contract Character is ERC3664Updatable, ERC721URIStorage, Ownable{
    using Strings for uint256;
    address payable private _owner = payable(0x627306090abaB3A6e1400e9345bC60c78a8BEf57);

    bool public _isSalesActive;

    bool public _isReveal;

    uint256 private totalSupply = 6;
    uint256 private attrQuantity;
    
    string public baseExtension = ".json";
    string public baseHeader = "ipfs://";
    string public notRevealUri;
    string baseURI;

    constructor() ERC721("Item_nft", "ITEM") ERC3664("http://localhost:3000/"){
        attrQuantity = 3;
        _mint(0, 'attack', 'ATTACK', '');
        _mint(1, 'speed', 'SPEED', '');
        _mint(2, 'defense', 'DEFENSE', '');
        baseURI = "QmY7iP9m5NYhvmqjgr7dmUSDiMndvDdwUHH9jMfeBkZUvH/";
        _isSalesActive = true;
        _isReveal = false;
        notRevealUri = "ipfs://QmY7iP9m5NYhvmqjgr7dmUSDiMndvDdwUHH9jMfeBkZUvH/unpack.json";
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

    function mint(address to, uint256 tokenId) external payable{
        require(_isSalesActive, "Not yet started selling");
        require(msg.value == 0.1 ether, "You don't have enough eth to mint token");
        
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

        if(_isReveal == false){
            return notRevealUri;
        }

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


    function _afterMintToken(uint256 tokenId) internal {
        uint256 id = totalSupply + tokenId * 3;
        attach(tokenId, 0, 1);
        attach(tokenId, 1, 1);
        attach(tokenId, 2, 1);
        _mint(address(this), id + 0);
        _mint(address(this), id + 1);
        _mint(address(this), id + 2);
    }

    function seperate(uint256 tokenId, uint256 attrId) external {   //seperate attribute from token
        require(_hasAttr(tokenId, attrId), "You don't have the attribute in this token");
        uint256 id = totalSupply + tokenId * 3;
        remove(tokenId, attrId);
        _transfer(address(this), ownerOf(tokenId), id + attrId);
    }

    function combine(uint256 tokenId, uint256 attrId) external {    //combine attribute with token
        uint256 id = totalSupply + tokenId * 3;
        attach(tokenId, attrId, 1);
        _transfer( ownerOf(tokenId), address(this), id + attrId);
    }


    //onlyOwner
    function  setSalesActive(bool state) public onlyOwner{
        _isSalesActive = state;
    }

    function  setReveal(bool state) public onlyOwner{
        _isReveal = state;
    }

    function  setBaseUri(string memory URI) public onlyOwner{
        baseURI = URI;
    }
    function  withdraw() external onlyOwner{
        _owner.transfer(address(this).balance);
    }

    //For test
    function burnToken(uint256 tokenId) public {   //Temp public
        _burn(tokenId);
    }

    function hasAttr(uint256 tokenId, uint256 attrId) external view returns(bool) { //Temp public
        return  _hasAttr(tokenId, attrId);
    }

    /*function getAccountBalance() external view returns(uint256){
        return address(this).balance;
    }*/
}
