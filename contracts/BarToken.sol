pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BarToken is ERC20, AccessControl {
    // Create a new role identifier for the minter role
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    uint ticketPrice = 0;

    constructor() ERC20("BarToken", "BAR") {
        // Grant the minter role to a specified account
        _setupRole(OWNER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public {
        // Check that the calling account has the minter role
        require(hasRole(OWNER_ROLE, msg.sender), "Caller is not an owner");
        _mint(to, amount);
    }
}