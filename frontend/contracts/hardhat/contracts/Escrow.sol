// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BountyEscrow is ReentrancyGuard {
    enum BountyStatus { UNFUNDED, FUNDED, ASSIGNED, APPROVED, PAID, REFUNDED }

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
    error OnlyOrgCanRefund();
    error CannotRefundAssignedBounty();
    error AlreadyRefunded();
    error RefundFailed();
    error HunterMismatch();

    event BountyCreated(uint256 indexed bountyId, address indexed org);
    event BountyFunded(uint256 indexed bountyId, uint256 amount);
    event HunterAssigned(uint256 indexed bountyId, address indexed hunter);
    event SolutionApproved(uint256 indexed bountyId);
    event PaymentReleased(uint256 indexed bountyId, address indexed hunter, uint256 amount);
    event PlatformFeePaid(uint256 indexed bountyId, uint256 fee);
    event BountyRefunded(uint256 indexed bountyId, address indexed org, uint256 amount);
    event HunterUnassigned(uint256 indexed bountyId, address indexed hunter);

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

    function refundBounty(uint256 bountyId) external nonReentrant {
        Bounty storage bounty = bounties[bountyId];
        
       
        if (msg.sender != bounty.org) revert OnlyOrgCanRefund();
        
       
        if (bounty.status != BountyStatus.FUNDED) revert CannotRefundAssignedBounty();
        
       
        if (bounty.status == BountyStatus.REFUNDED) revert AlreadyRefunded();

        uint256 refundAmount = bounty.amount;
        bounty.status = BountyStatus.REFUNDED;

        
        (bool sent, ) = bounty.org.call{value: refundAmount}("");
        if (!sent) revert RefundFailed();

        emit BountyRefunded(bountyId, bounty.org, refundAmount);
    }

    function unassignBounty(uint256 bountyId) external {
        Bounty storage bounty = bounties[bountyId];
        if (msg.sender != bounty.hunter) revert HunterMismatch();
        if (bounty.status != BountyStatus.ASSIGNED) revert NotAssigned();

        address previousHunter = bounty.hunter;
        bounty.hunter = address(0);
        bounty.status = BountyStatus.FUNDED;
        
        emit HunterUnassigned(bountyId, previousHunter);
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