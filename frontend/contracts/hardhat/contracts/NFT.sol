// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract BountiFiBadge is ERC721URIStorage {
    uint256 private _tokenIdCounter;
    mapping(address => bool) public hasMinted;

    constructor() ERC721("BountiFiBadge", "BBADGE") {
        _tokenIdCounter = 1;
    }

    function safeMint(string memory tokenURI) public {
        require(!hasMinted[msg.sender], "You already own a badge");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
}
