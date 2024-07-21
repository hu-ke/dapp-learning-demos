import React, { useState, useEffect } from 'react';
import getWeb3 from './utils/getWeb3';
import DeFiContract from './contracts/DeFiContract.json';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState('0');
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = DeFiContract.networks[networkId];
        const instance = new web3.eth.Contract(
          DeFiContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);

        const balance = await instance.methods.getBalance().call({ from: accounts[0] });
        setBalance(web3.utils.fromWei(balance, 'ether'));
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const handleDeposit = async () => {
    if (contract) {
      const amount = web3.utils.toWei(depositAmount, 'ether');
      await contract.methods.deposit().send({ from: accounts[0], value: amount });
      const balance = await contract.methods.getBalance().call({ from: accounts[0] });
      setBalance(web3.utils.fromWei(balance, 'ether'));
      setDepositAmount('');
    }
  };

  const handleWithdraw = async () => {
    if (contract) {
      const amount = web3.utils.toWei(depositAmount, 'ether');
      await contract.methods.withdraw(amount).send({ from: accounts[0] });
      const balance = await contract.methods.getBalance().call({ from: accounts[0] });
      setBalance(web3.utils.fromWei(balance, 'ether'));
      setDepositAmount('');
    }
  };

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>DeFi App</h1>
      <p>Account: {accounts && accounts[0]}</p>
      <p>Balance: {balance} ETH</p>
      <div>
        <input
          type="text"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={handleDeposit}>Deposit</button>
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  );
};

export default App;
