
const hre = require("hardhat");

async function main() {
  if (window.ethereum) {
    const contract = new ethers.Contract(
      barTokenAddress,
      barTokenAbi.abi,
      signer
    );
    try {
      const response = await contract.mint(BigNumber.from(10000));
      console.log("response: ", response);
    } catch(error) {
      console.log("error: ", error);
    }
  }
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });