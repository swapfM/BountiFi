// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// contract BountyEscrow is ReentrancyGuard {
//     enum BountyStatus { UNFUNDED, FUNDED, ASSIGNED, APPROVED, PAID }

//     struct Bounty {
//         address org;
//         address hunter;
//         uint256 amount;
//         BountyStatus status;
//     }

//     mapping(uint256 => Bounty) public bounties;

//     address public platform;

//     event Log(string message);
//     event BountyCreated(uint256 bountyId, address org);
//     event BountyFunded(uint256 bountyId, uint256 amount);
//     event HunterAssigned(uint256 bountyId, address hunter);
//     event SolutionApproved(uint256 bountyId);
//     event PaymentReleased(uint256 bountyId, address hunter, uint256 amount);
//     event PlatformFeePaid(uint256 bountyId, uint256 fee);

//     constructor(address _platform) {
//         require(_platform != address(0), "Invalid platform address");
//         platform = _platform;
//     }

//     // Fund a bounty
//     function fundBounty(uint256 bountyId) external payable {
//         require(msg.value > 0, "Send some ETH");

//         Bounty storage bounty = bounties[bountyId];
//         require(bounty.status == BountyStatus.UNFUNDED, "Already funded");

//         bounty.org = msg.sender;
//         bounty.amount = msg.value;
//         bounty.status = BountyStatus.FUNDED;

//         emit Log("Bounty funded");
//         emit BountyCreated(bountyId, msg.sender);
//         emit BountyFunded(bountyId, msg.value);
//     }

//     // Assign hunter
//     function assignHunter(uint256 bountyId) external {
//         Bounty storage bounty = bounties[bountyId];
//         require(bounty.status == BountyStatus.FUNDED, "Bounty not funded");
//         require(bounty.hunter == address(0), "Already assigned");

//         bounty.hunter = msg.sender;
//         bounty.status = BountyStatus.ASSIGNED;

//         emit Log("Hunter assigned");
//         emit HunterAssigned(bountyId, msg.sender);
//     }

//     // Approve and release
//     function approveSolution(uint256 bountyId) external {
//         Bounty storage bounty = bounties[bountyId];
//         require(msg.sender == bounty.org, "Only org can approve");
//         require(bounty.status == BountyStatus.ASSIGNED, "Not assigned");
//         require(bounty.hunter != address(0), "No hunter");

//         bounty.status = BountyStatus.APPROVED;
//         emit SolutionApproved(bountyId);
//         emit Log("Solution approved");

//         _releasePayment(bountyId);
//     }

//     function _releasePayment(uint256 bountyId) internal nonReentrant {
//         Bounty storage bounty = bounties[bountyId];
//         require(bounty.status == BountyStatus.APPROVED, "Not approved");

//         uint256 totalAmount = bounty.amount;
//         bounty.status = BountyStatus.PAID;

//         uint256 fee = (totalAmount * 5) / 100; // 5% fee
//         uint256 hunterAmount = totalAmount - fee;

//         // Transfer fee to platform
//         (bool feeSent, ) = platform.call{value: fee}("");
//         require(feeSent, "Fee transfer failed");
//         emit PlatformFeePaid(bountyId, fee);

//         // Transfer remaining to hunter
//         (bool sent, ) = bounty.hunter.call{value: hunterAmount}("");
//         require(sent, "Payment to hunter failed");

//         emit PaymentReleased(bountyId, bounty.hunter, hunterAmount);
//         emit Log("Payment sent to hunter");
//     }
// }

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BountyEscrow is ReentrancyGuard {
    enum BountyStatus { UNFUNDED, FUNDED, ASSIGNED, APPROVED, PAID }

    struct Bounty {
        address org;
        address hunter;
        uint128 amount; 
        BountyStatus status;
    }

    mapping(uint256 => Bounty) public bounties;

    address public immutable platform; 

   
    error InvalidPlatformAddress();
    error NoEthSent();
    error AlreadyFunded();
    error BountyNotFunded();
    error AlreadyAssigned();
    error OnlyOrgCanApprove();
    error NotAssigned();
    error NoHunter();
    error NotApproved();
    error FeeTransferFailed();
    error PaymentFailed();

    event BountyCreated(uint256 indexed bountyId, address indexed org);
    event BountyFunded(uint256 indexed bountyId, uint256 amount);
    event HunterAssigned(uint256 indexed bountyId, address indexed hunter);
    event SolutionApproved(uint256 indexed bountyId);
    event PaymentReleased(uint256 indexed bountyId, address indexed hunter, uint256 amount);
    event PlatformFeePaid(uint256 indexed bountyId, uint256 fee);

    constructor(address _platform) {
        if (_platform == address(0)) revert InvalidPlatformAddress();
        platform = _platform;
    }

  
    function fundBounty(uint256 bountyId) external payable {
        if (msg.value == 0) revert NoEthSent();

        Bounty storage bounty = bounties[bountyId];
        if (bounty.status != BountyStatus.UNFUNDED) revert AlreadyFunded();

        bounty.org = msg.sender;
        bounty.amount = uint128(msg.value); 
        bounty.status = BountyStatus.FUNDED;

        emit BountyCreated(bountyId, msg.sender);
        emit BountyFunded(bountyId, msg.value);
    }

  
    function assignHunter(uint256 bountyId) external {
        Bounty storage bounty = bounties[bountyId];
        if (bounty.status != BountyStatus.FUNDED) revert BountyNotFunded();
        if (bounty.hunter != address(0)) revert AlreadyAssigned();

        bounty.hunter = msg.sender;
        bounty.status = BountyStatus.ASSIGNED;

        emit HunterAssigned(bountyId, msg.sender);
    }

   
    function approveSolution(uint256 bountyId) external {
        Bounty storage bounty = bounties[bountyId];
        if (msg.sender != bounty.org) revert OnlyOrgCanApprove();
        if (bounty.status != BountyStatus.ASSIGNED) revert NotAssigned();
        if (bounty.hunter == address(0)) revert NoHunter();

        bounty.status = BountyStatus.APPROVED;
        emit SolutionApproved(bountyId);

        _releasePayment(bountyId);
    }

    function _releasePayment(uint256 bountyId) internal nonReentrant {
        Bounty storage bounty = bounties[bountyId];
        if (bounty.status != BountyStatus.APPROVED) revert NotApproved();

        uint256 totalAmount = bounty.amount;
        bounty.status = BountyStatus.PAID;

        
        uint256 fee;
        uint256 hunterAmount;
        
        unchecked {
            fee = totalAmount / 20; 
            hunterAmount = totalAmount - fee;
        }

       
        (bool feeSent, ) = platform.call{value: fee}("");
        if (!feeSent) revert FeeTransferFailed();
        emit PlatformFeePaid(bountyId, fee);

      
        (bool sent, ) = bounty.hunter.call{value: hunterAmount}("");
        if (!sent) revert PaymentFailed();

        emit PaymentReleased(bountyId, bounty.hunter, hunterAmount);
    }
}