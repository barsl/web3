
const hre = require("hardhat");

async function main() {

  const LottoBar = await hre.ethers.getContractFactory("contracts/LottoBar.sol:LottoBar");
  const lottoBar = await LottoBar.deploy();

  await lottoBar.deployed();

  console.log("LottoBar deployed to:", lottoBar.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });