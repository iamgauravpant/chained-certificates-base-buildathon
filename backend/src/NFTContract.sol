// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.2/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@5.0.2/access/Ownable.sol";

contract NFTContract is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(string memory name , string memory symbol)
        ERC721(name,symbol)
        Ownable(msg.sender)
    {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
    }

    function setTokenURI(uint256 tokenId,string memory uri) public onlyOwner {
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
