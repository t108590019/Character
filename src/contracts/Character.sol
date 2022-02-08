pragma solidity ^0.8.0;

import "./ERC3664/ERC3664.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract Character is ERC3664{
    constructor () ERC3664("https://foxNFT"){}

    function mint(
        uint256 attrId,
        string memory _name,
        string memory _symbol,
        string memory _uri
    )public returns(bool){
        _mint(attrId, _name, _symbol, _uri);
        return true;
    }
}
