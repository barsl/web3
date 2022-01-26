import './App.css';
import mintExampleAbi from "./mintExampleAbi.json";
import barTokenAbi from "./barTokenAbi.json";
import {ethers, BigNumber} from "ethers";
import { useEffect, useState } from "react";

const barTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const lottoBarTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {

  const [accounts, setAccounts] = useState([])

  async function connectAccounts() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccounts(accounts);
    }
  }

  useEffect(() => {
    connectAccounts();
  }, []);

  const [depositAmount, setDepositAmount] = useState(1);


  async function handleMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        barTokenAddress,
        barTokenAbi.abi,
        signer
      );
      try {
        const response = await contract.mint(BigNumber.from(depositAmount));
        console.log("response: ", response);
      } catch(error) {
        console.log("error: ", error);
      }
    }
  }


  return (
    <div className="App">
      {!accounts.length && (
        <p>
          App will load after connecting
        </p>
      )}      
      {accounts.length && (
        <div>
          <button onClick={()=> setMintAmount(mintAmount - 1)}> - </button>
            {mintAmount}
          <button onClick={()=> setMintAmount(mintAmount + 1)}> + </button>
          <button onClick={handleMint}> Mint </button>
        </div>

      )}
    </div>
  );
}

export default App;
