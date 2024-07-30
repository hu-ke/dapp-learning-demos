import React, { useCallback, useEffect, useState } from 'react';
import { Tabs, Button, Card } from 'antd';
import './App.css';
import Account from './components/Account';
import { getMintedNFTs } from './utils/http'
import MyNFTs from './pages/MyNFTs';
import { ethers } from 'ethers';
import MyNFTContract from './contracts/MyNFT.json'
import shortAddress from './utils/shortAddress'

const TAB_KEYS = {
  TRENDING_NFTS: '1',
  MY_NFTS: '2'
}

const App = () => {
  const [account, setAccount] = useState()
  const [activeTabKey, setActiveTabKey] = useState(TAB_KEYS.TRENDING_NFTS)
  const [mintedNFTs, setMintedNFTs] = useState([])
  const [uris, setURIs] = useState([])
  const [nftContractInstance, setNFTContractInstance] = useState()
  const [provider, setProvider] = useState()

  const buyNFT = (nft) => {
    // 转移NFT
    const transaction = await nftContractInstance.transferFrom(accountA, accountB, nftTokenId);
    await transaction.wait();
    console.log('NFT Transferred');

    // 转移资金
    // const tx = {
    //   to: accountA,
    //   value: ethers.utils.parseEther(transferAmount)
    // };
    // const sendTransaction = await signer.sendTransaction(tx);
    // await sendTransaction.wait();
    // console.log('Funds Transferred');
  }

  const items = [
    {
      key: TAB_KEYS.TRENDING_NFTS,
      label: 'Trending NFTs',
      children: (
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          {
            mintedNFTs.length > 0 ? mintedNFTs.map(nft => {
              return (
                <Card
                  key={nft.id}
                  actions={[
                    nft.account !== account ? <Button type="primary" onClick={() => { buyNFT(nft) }}>Buy</Button> : "My NFT"
                  ]}
                  hoverable
                  styles={{
                    body: {
                      padding: 10
                    }
                  }}
                  style={{ width: 260 }}
                  cover={<img alt="nft image" src={nft.image} />}
                >
                  <h2 style={{margin: 0}}>{nft.name}</h2>
                  <div>{nft.description}</div>
                  <div>price: {nft.price} ETH</div>
                  <div>Owner: {shortAddress(nft.account)}</div>
                </Card>
              )
            }) : ''
          }
        </div>
      ),
    },
    {
      key: TAB_KEYS.MY_NFTS,
      label: 'My NFTs',
      children: (
        <MyNFTs account={account} nftContractInstance={nftContractInstance} uris={uris} />
      ),
    }
  ];

  const onChange = (key) => {
    setActiveTabKey(key)
  }

  const fetchURIs = async() => {
    const contractAddress = '0x0c6D5a3840A9e3EC22e416cB9f64C230fCCd319f'
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const myNFTContract = new ethers.Contract(contractAddress, MyNFTContract.abi, provider)
    setNFTContractInstance(myNFTContract)

    const totalSupply = await myNFTContract.totalSupply()
    const uris = []

    for (var i = 1; i <= totalSupply; i++) {
      const uri = await myNFTContract.tokenURI(i)
      uris.push(uri)
    }
    setURIs(uris)
  }

  useEffect(() => {
    fetchURIs()
  }, [])

  const fetchMintedNFTs = useCallback(async() => {
    if (uris.length > 0 && activeTabKey === TAB_KEYS.TRENDING_NFTS) {
      let res = await getMintedNFTs(uris)
      if (res.code === 200) {
        setMintedNFTs(res.data)
      }
    }
  }, [uris, activeTabKey])

  useEffect(() => {
    fetchMintedNFTs()
  }, [fetchMintedNFTs])

  const onConnected = (account) => {
    setAccount(account)
  }

  return (
    <div className="App">
      <Account onConnected={onConnected} />
      <Tabs activeKey={activeTabKey} items={items} onChange={onChange} />
    </div>
  );
};

export default App;
