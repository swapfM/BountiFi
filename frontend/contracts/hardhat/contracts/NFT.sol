// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract BountiFiBadge is ERC721URIStorage {
    uint256 private _tokenIdCounter = 1;
    uint256 public constant MAX_SUPPLY = 10000;
    

    mapping(address => uint8) public hasMinted;

    error AlreadyMinted();
    error EmptyTokenURI();
    error MaxSupplyExceeded();

    constructor() ERC721("BountiFiBadge", "BBADGE") {}
    
    function safeMint(string calldata uri) external {
        if (_tokenIdCounter > MAX_SUPPLY) revert MaxSupplyExceeded();
        if (bytes(uri).length == 0) revert EmptyTokenURI();
        if (hasMinted[msg.sender] != 0) revert AlreadyMinted();
        uint256 tokenId = _tokenIdCounter;
        hasMinted[msg.sender] = 1;
        unchecked {
            _tokenIdCounter++;
        }
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }
    

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
}