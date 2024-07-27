import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFT from './contracts/MyNFT.json';

const nftAddress = "0x69898db907682BEB2B8a21df631AB829B668e893"; // contract address

function App() {
  const [tokenURI, setTokenURI] = useState("");
  const [nfts, setNfts] = useState([]);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function requestAccount() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  }

  async function mintNFT() {
    if (!tokenURI) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log('start minting')
      const contract = new ethers.Contract(nftAddress, MyNFT.abi, signer);
      const transaction = await contract.mintNFT(signer.getAddress(), tokenURI);
      await transaction.wait();
      console.log('after minting')
      loadNFTs();
    }
  }

  async function loadNFTs() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(nftAddress, MyNFT.abi, provider);
      const totalSupply = await contract.totalSupply();
      console.log('totalSupply', totalSupply)
      const items = [];
      for (let i = 1; i <= totalSupply; i++) {
        const tokenURI = await contract.tokenURI(i);
        const owner = await contract.ownerOf(i);
        items.push({ tokenId: i, tokenURI, owner: owner.toLowerCase() });
      }
      console.log('nfts>', nfts)
      setNfts(items);
    }
  }

  async function transferNFT(to, tokenId) {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftAddress, MyNFT.abi, signer);
      const transaction = await contract.transferNFT(account, to, tokenId);
      await transaction.wait();
      loadNFTs();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <input
          onChange={e => setTokenURI(e.target.value)}
          placeholder="Enter token URI"
        />
        <button onClick={requestAccount}>Connect Wallet</button>
        <button onClick={mintNFT}>Mint NFT</button>
        {JSON.stringify(nfts[0])}
        <div>
          {nfts.map((nft, index) => (
            <div key={index}>
              <img src={nft.tokenURI} alt={`NFT ${nft.tokenId}`} width="200" />
              <p>Owner: {nft.owner}</p>
              <p>Account: {account}</p>
              {nft.owner === account ? (
                <input
                  placeholder="Enter recipient address"
                  onBlur={(e) => transferNFT(e.target.value, nft.tokenId)}
                />
              ) : 'null'}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
