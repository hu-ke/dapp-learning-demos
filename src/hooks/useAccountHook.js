import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function useAccountHook() {
  const [account, setAccount] = useState()

  const connect = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account);
  }

  useEffect(() => {
    connect()
  }, [])

  return [account]
}

export default useAccountHook;
