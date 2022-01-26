pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "./hardhat/console.sol";

// Interface for ERC20 DAI contract
interface BarToken {
    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function balanceOf(address) external view returns (uint256);
}

contract LottoBar is AccessControl {


    // Variables
    string public name = "LottoBar";
    address public owner;
    uint public ticketPrice;
    uint public pool;
    address public winner;
    uint public winningTickets;
    uint fees;

    mapping (address => uint256) public userTickets;

    uint public lastDrawTime;

    mapping(address => uint) balances;

    BarToken bar; // address that bartoken was deployed to
    
    // // Events
    // event Deposit(address owner, uint256 amount, address depositTo);
    // event Withdraw(address owner, uint256 amount, address withdrawFrom);

    // Roles
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");


    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Constructor
    constructor(BarToken _bar, address mngr1, address mngr2, uint _ticketPrice) {
        _setupRole(OWNER_ROLE, msg.sender);
        _setupRole(MANAGER_ROLE, mngr1);
        _setupRole(MANAGER_ROLE, mngr2);
        owner = msg.sender;
        bar = _bar;
        lastDrawTime = block.timestamp;
        ticketPrice = _ticketPrice;
    }

    function getUserTickets(address user) public onlyOwner view returns(uint){
        // Check that the calling account has the minter role
        require(hasRole(OWNER_ROLE, msg.sender), "Caller is not an owner");
        return userTickets[user];
    }

    function adjustTicketPrice(uint256 newTicketPrice) public {
        // Check that the calling account has the minter role
        require(hasRole(OWNER_ROLE, msg.sender), "Caller is not an owner");
        ticketPrice = newTicketPrice;
    }

    function deposit(uint256 _amount) public onlyOwner {
        // _amount needs to be greater than 0 and a multiple of ticket price
        require(_amount > 0);


        bar.transferFrom(msg.sender, address(this), _amount);
        pool = pool + (_amount * 9500 / 10000);
        fees = fees + (_amount * 500 / 10000);

        uint purchasedTickets = (_amount / ticketPrice);
        userTickets[msg.sender] = purchasedTickets;

        // if (purchasedTickets > winningTickets){
        winningTickets = purchasedTickets;
        winner = msg.sender;
        // }

    }

    function drawLotto() public returns(uint){
        // require(block.timestamp >= lastDrawTime + 5 minutes, "hasn't been 5 minutes yet");
        require(hasRole(MANAGER_ROLE, msg.sender) || hasRole(OWNER_ROLE, msg.sender), "Caller is not an owner/manager");
        // require(hasRole(OWNER_ROLE, msg.sender), "Caller is not an owner/manager");

        bar.approve(winner, pool);
        uint payWinner = pool;
        pool = 0;
        
        lastDrawTime = block.timestamp;
        return payWinner;
    }

}