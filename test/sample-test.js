const { expect } = require("chai");
const { ethers, BigNumber } = require("hardhat");
// const {BigNumber} = re"ethers";

describe('BarToken contract', () => {
  let Token, token, owner, addr1, addr2;

  beforeEach(async () => {
    Token = await ethers.getContractFactory('contracts/BarToken.sol:BarToken');
    token = await Token.deploy();
    // console.log("token: ", token);

    [owner, addr1, addr2, _] = await ethers.getSigners();
  });

  describe('Deployment', () => {
    it("Should set the right owner", async () => {
      // console.log(token.owner)
      owner_role = await token.deployTransaction.from;

      expect(await owner_role).to.equal(owner.address)
    });
  });

  describe('Minting', () => {
    it("Should mint 555 tokens to the owner", async () => {
      let balanceBefore = await token.balanceOf(owner.address)
      console.log("balanceBefore: ", balanceBefore)
      await token.mint(owner.address, ethers.BigNumber.from("555"))
      let balanceAfter = await token.balanceOf(owner.address)
      console.log("balanceAfter: ", balanceAfter)

      expect(await balanceAfter).to.equal("555")
    });
  });

});

describe('BarToken contract', () => {
  let Lotto, lotto, owner, addr1, addr2;

  beforeEach(async () => {
    Bar = await ethers.getContractFactory('contracts/BarToken.sol:BarToken');
    bar = await Bar.deploy();    
    [ownerBar, addr1Bar, addr2Bar, _] = await ethers.getSigners();

    Lotto = await ethers.getContractFactory('LottoBar');
    [owner, addr1, addr2, _] = await ethers.getSigners();
    lotto = await Lotto.deploy(bar.address, addr1.address, addr1.address, ethers.utils.parseEther("50"));
    

  });

  describe('Deployment', () => {
    it("Should set the right owner", async () => {

      owner_role = await lotto.deployTransaction.from;


      expect(await owner_role).to.equal(owner.address)
    });

    it("Should set two managers", async () => {
      
      manager_role = await lotto.MANAGER_ROLE();

      // addr1 is first manager
      mngr_role_obj = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MANAGER_ROLE'))
      has_mngr_role = await lotto.hasRole(mngr_role_obj,addr1.address)
      expect(await has_mngr_role).to.equal(true)

      // addr2 is second manager
      // mngr_role_obj = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MANAGER_ROLE'))
      // has_mngr_role = await lotto.hasRole(mngr_role_obj,addr2.address)
      // expect(await has_mngr_role).to.equal(true)      

    });


    
  });



  describe('Depositing', () => {
    it("Should deposit 1 token to the lottery pool", async () => {

      // mint some Bar to deposit
      let balanceBefore = await bar.balanceOf(ownerBar.address)
      console.log("balanceBefore: ", balanceBefore)
      await bar.mint(ownerBar.address, ethers.utils.parseEther("555"));
      let balanceAfter = await bar.balanceOf(ownerBar.address)
      console.log("balanceAfter: ", balanceAfter)

      // approve lotto to spend my money
      await bar.connect(ownerBar).approve(lotto.address, ethers.utils.parseEther("555"))

      // deposit
      console.log("BAR ADD: " , bar.address)
      await lotto.connect(ownerBar).deposit(ethers.utils.parseEther("1"));
      const pool = await lotto.pool();
      console.log("POOL: ", pool);      

      expect(await balanceAfter).to.equal("555000000000000000000")
    });

    it("should keep track of users tickets", async () => {

      // get the ticket balance for user

      // mint some Bar to deposit
      let balanceBefore = await bar.balanceOf(ownerBar.address)
      console.log("balanceBefore: ", balanceBefore)
      await bar.mint(ownerBar.address, ethers.utils.parseEther("555"));
      let balanceAfter = await bar.balanceOf(ownerBar.address)
      console.log("balanceAfter: ", balanceAfter)

      // approve lotto to spend my money
      await bar.connect(ownerBar).approve(lotto.address, ethers.utils.parseEther("555"))


      // get ticket price
      ticketPrice = await lotto.ticketPrice();
      // const gweiValue = ethers.utils.formatUnits(ticketPrice, "ether");
      const gweiValue = ethers.utils.formatEther(ticketPrice);
      console.log("TICKET PRICE: ", gweiValue);
      // set price of five tickets
      fiveTicketsBundlePrice = 5 * gweiValue;
      console.log("TICKET fiveTicketsBundlePrice: ", fiveTicketsBundlePrice);
      // deposit to lotto
      console.log("BAR ADD: " , bar.address);
      await lotto.connect(ownerBar).deposit(ethers.utils.parseEther(fiveTicketsBundlePrice.toString()));
      const pool = await lotto.pool();
      console.log("POOL: ", pool);      
      const ownersTickets = await lotto.getUserTickets(ownerBar.address);
      console.log("OWNERTICKETS: ", ownersTickets);

      expect(await ownersTickets).to.equal("5")
    });    

  });

  describe('Drawing', () => {
    it("Owner should be able to draw the lottery", async () => {

      // mint some Bar to deposit
      let balanceBefore = await bar.balanceOf(ownerBar.address)
      console.log("balanceBefore: ", balanceBefore)
      await bar.mint(ownerBar.address, ethers.utils.parseEther("555"));
      let balanceAfter = await bar.balanceOf(ownerBar.address)
      console.log("balanceAfter: ", balanceAfter)

      // approve lotto to spend my money
      await bar.connect(ownerBar).approve(lotto.address, ethers.utils.parseEther("555"))

      // deposit
      console.log("BAR ADD: " , bar.address)
      await lotto.connect(ownerBar).deposit(ethers.utils.parseEther("1"));
      const pool = await lotto.pool();
      console.log("POOL: ", pool);   
      
      
      // draw
      await lotto.connect(ownerBar).drawLotto();
      bar.transferFrom(lotto.address, ownerBar.address, pool);
      const poolAfter = await lotto.pool();
      console.log("poolAfter: ", poolAfter);

      expect(await bar.balanceOf(ownerBar.address)).to.equal("554950000000000000000");
    });

    it("Manager should be able to draw the lottery", async () => {

      // mint some Bar to deposit
      let balanceBefore = await bar.balanceOf(ownerBar.address)
      console.log("balanceBefore: ", balanceBefore)
      await bar.mint(ownerBar.address, ethers.utils.parseEther("555"));
      let balanceAfter = await bar.balanceOf(ownerBar.address)
      console.log("balanceAfter: ", balanceAfter)

      // approve lotto to spend my money
      await bar.connect(ownerBar).approve(lotto.address, ethers.utils.parseEther("555"))

      // deposit
      console.log("BAR ADD: " , bar.address)
      await lotto.connect(ownerBar).deposit(ethers.utils.parseEther("1"));
      const pool = await lotto.pool();
      console.log("POOL: ", pool);   
      
      
      // draw
      winner = await lotto.connect(addr1).drawLotto();
      const poolAfter = await lotto.pool();
      console.log("poolAfter: ", poolAfter);
      
      // pull winners money -- TODO get address from contract
      bar.transferFrom(lotto.address, ownerBar.address, pool);


      expect(await bar.balanceOf(ownerBar.address)).to.equal("554950000000000000000");
    });

    // it("Otherwise should not be able to draw the lottery", async () => {

    //   // mint some Bar to deposit
    //   let balanceBefore = await bar.balanceOf(ownerBar.address)
    //   console.log("balanceBefore: ", balanceBefore)
    //   await bar.mint(ownerBar.address, ethers.utils.parseEther("555"));
    //   let balanceAfter = await bar.balanceOf(ownerBar.address)
    //   console.log("balanceAfter: ", balanceAfter)

    //   // approve lotto to spend my money
    //   await bar.connect(ownerBar).approve(lotto.address, ethers.utils.parseEther("555"))

    //   // deposit
    //   console.log("BAR ADD: " , bar.address)
    //   await lotto.connect(ownerBar).deposit(ethers.utils.parseEther("1"));
    //   const pool = await lotto.pool();
    //   console.log("POOL: ", pool);   
      
      
    //   // draw
    //   await lotto.connect(addr2).drawLotto();
    //   bar.transferFrom(lotto.address, ownerBar.address, pool);
    //   const poolAfter = await lotto.pool();
    //   console.log("poolAfter: ", poolAfter);

    //   expect(await bar.balanceOf(ownerBar.address)).to.equal("554950000000000000000");
    // });    

  });
  

});