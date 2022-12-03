// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract shakaPortal {
    uint256 totalShakas;
    address[] fwens;

    uint256 private seed;

    event newShaka(address indexed from, uint256 timestamp, string message);

    struct Shaka {
        address user; // The address of the user who shaka.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    Shaka[] shakas;

    mapping(address => uint256) public lastWavedAt;

    constructor() payable{
        console.log("shaka contract activated");
        seed = (block.timestamp + block.difficulty) % 100;
    }

   function shaka(string memory _message) public {
     require(
           lastWavedAt[msg.sender] + 5 minutes < block.timestamp,
           "Wait 5m"
       );
      lastWavedAt[msg.sender] = block.timestamp;

       totalShakas += 1;
       fwens.push(msg.sender);
       console.log("new shaka sent by %s", msg.sender, _message);

       shakas.push(Shaka(msg.sender, _message, block.timestamp));

       seed = (block.difficulty + block.timestamp + seed) % 100;

       console.log("Random # generated: %d", seed);

       if (seed < 20) {
         console.log("%s won!", msg.sender);
         uint256 prizeAmount = 0.0001 ether;
         require(prizeAmount <= address(this).balance,"Trying to withdraw more money than the contract has.");
         (bool success, ) = (msg.sender).call{value: prizeAmount}("");
         require(success, "Failed to withdraw money from contract.");
       }

       emit newShaka(msg.sender, block.timestamp, _message);

   }

   function getAllShakas() public view returns (Shaka[] memory) {
       return shakas;
   }

   function getTotalShakas() public view returns (uint256) {
       console.log("total shakas: %d", totalShakas);
       return totalShakas;
   }

   function getFwens() public view{
     console.log("shaka fwens:");
     for (uint i = 0; i < fwens.length; i++) {
       console.log("%s", fwens[i]);
     }
   }

}
