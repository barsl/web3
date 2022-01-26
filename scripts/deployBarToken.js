
const hre = require("hardhat");

async function main() {

  const BarToken = await hre.ethers.getContractFactory("contracts/BarToken.sol:BarToken");
  const barToken = await BarToken.deploy();

  await barToken.deployed();

  console.log("BarToken deployed to:", barToken.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });