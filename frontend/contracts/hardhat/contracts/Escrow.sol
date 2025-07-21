// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BountyEscrow is ReentrancyGuard {
    enum BountyStatus { UNFUNDED, FUNDED, ASSIGNED, APPROVED, PAID }

    struct Bounty {
        address org;
        address hunter;
        uint256 amount;
        BountyStatus status;
    }

    mapping(uint256 => Bounty) public bounties;

    address public platform;

    event Log(string message);
    event BountyCreated(uint256 bountyId, address org);
    event BountyFunded(uint256 bountyId, uint256 amount);
    event HunterAssigned(uint256 bountyId, address hunter);
    event SolutionApproved(uint256 bountyId);
    event PaymentReleased(uint256 bountyId, address hunter, uint256 amount);
    event PlatformFeePaid(uint256 bountyId, uint256 fee);

    constructor(address _platform) {
        require(_platform != address(0), "Invalid platform address");
        platform = _platform;
    }

    // Fund a bounty
    function fundBounty(uint256 bountyId) external payable {
        require(msg.value > 0, "Send some ETH");

        Bounty storage bounty = bounties[bountyId];
        require(bounty.status == BountyStatus.UNFUNDED, "Already funded");

        bounty.org = msg.sender;
        bounty.amount = msg.value;
        bounty.status = BountyStatus.FUNDED;

        emit Log("Bounty funded");
        emit BountyCreated(bountyId, msg.sender);
        emit BountyFunded(bountyId, msg.value);
    }

    // Assign hunter
    function assignHunter(uint256 bountyId) external {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.status == BountyStatus.FUNDED, "Bounty not funded");
        require(bounty.hunter == address(0), "Already assigned");

        bounty.hunter = msg.sender;
        bounty.status = BountyStatus.ASSIGNED;

        emit Log("Hunter assigned");
        emit HunterAssigned(bountyId, msg.sender);
    }

    // Approve and release
    function approveSolution(uint256 bountyId) external {
        Bounty storage bounty = bounties[bountyId];
        require(msg.sender == bounty.org, "Only org can approve");
        require(bounty.status == BountyStatus.ASSIGNED, "Not assigned");
        require(bounty.hunter != address(0), "No hunter");

        bounty.status = BountyStatus.APPROVED;
        emit SolutionApproved(bountyId);
        emit Log("Solution approved");

        _releasePayment(bountyId);
    }

    function _releasePayment(uint256 bountyId) internal nonReentrant {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.status == BountyStatus.APPROVED, "Not approved");

        uint256 totalAmount = bounty.amount;
        bounty.status = BountyStatus.PAID;

        uint256 fee = (totalAmount * 5) / 100; // 5% fee
        uint256 hunterAmount = totalAmount - fee;

        // Transfer fee to platform
        (bool feeSent, ) = platform.call{value: fee}("");
        require(feeSent, "Fee transfer failed");
        emit PlatformFeePaid(bountyId, fee);

        // Transfer remaining to hunter
        (bool sent, ) = bounty.hunter.call{value: hunterAmount}("");
        require(sent, "Payment to hunter failed");

        emit PaymentReleased(bountyId, bounty.hunter, hunterAmount);
        emit Log("Payment sent to hunter");
    }
}
