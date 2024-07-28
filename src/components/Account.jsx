import React, { useState } from 'react';
import { Button } from 'antd'
import { ethers } from 'ethers';

function Account() {
  const [account, setAccount] = useState()

  const connect = async() => {
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // const network = await provider.getNetwork()
    // console.log(network)
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account);
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
      {
        account ? `Connected: ${account}` : <Button type="primary" onClick={connect}>Connect to Wallet</Button>
      }
    </div>
  );
}

export default Account;