import { useEffect } from "react";
import getWeb3 from '../utils/getWeb3';
import Profile from "../contracts/Profile.json";
import Twitter from "../contracts/Twitter.json";

const Connect = ({
  web3,
  account,
  shortAddress,
  setTwitterInstance,
  setAccount,
  setProfileInstance,
  setWeb3
}) => {

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const contractInstance = new tempWeb3.eth.Contract(
          contractABI,
          contractAddress
        );

        const profileInstance = new tempWeb3.eth.Contract(
          profileContractABI,
          profileContractAddress
        );
        setUser(profileInstance);
        const accounts = await tempWeb3.eth.getAccounts();
        console.log("aCCOUNTS", accounts);
        if (accounts.length > 0) {
          setTwitterInstance(contractInstance);
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("No web3 provider detected");
    }
  }

  useEffect(() => {
    const init = async() => {
      const web3 = await getWeb3();
      setWeb3(web3)
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
      const networkId = await web3.eth.net.getId();

      const twitterInstance = new web3.eth.Contract(
        Twitter.abi,
        Twitter.networks[networkId].address
      );
      setTwitterInstance(twitterInstance)

      const profileInstance = new web3.eth.Contract(
        Profile.abi,
        Profile.networks[networkId].address
      );
      setProfileInstance(profileInstance)
    }
    init()
  }, [])

  return (
    <>
      <div className="connect">
        {!account ? (
          <button id="connectWalletBtn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div id="userAddress">Connected: {shortAddress(account)}</div>
        )}
      </div>
      <div id="connectMessage">
        {!account ? "Please connect your wallet to tweet." : ""}
      </div>
    </>
  );
};

export default Connect;
