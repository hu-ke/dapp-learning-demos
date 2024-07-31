import React, { useCallback, useEffect, useState } from 'react';
import { Tabs, Button, Card } from 'antd';
import './App.css';
import useAccountHook from './hooks/useAccountHook';
import { getMintedNFTs } from './utils/http'
import MyNFTs from './pages/MyNFTs';
import { ethers } from 'ethers';
import MyNFTContract from './contracts/MyNFT.json'
import shortAddress from './utils/shortAddress'
import NFT from './components/NFT'

const TAB_KEYS = {
  TRENDING_NFTS: '1',
  MY_NFTS: '2'
}

const App = () => {
  const [account] = useAccountHook()
  const [activeTabKey, setActiveTabKey] = useState(TAB_KEYS.TRENDING_NFTS)
  const [mintedNFTs, setMintedNFTs] = useState([])
  const [uris, setURIs] = useState([])
  const [nftContractInstance, setNFTContractInstance] = useState()
  const [provider, setProvider] = useState()

  const buyNFT = async(nft) => {
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

  const onTabChange = (key) => {
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

  return (
    <div className="App">
      <div className="bg-wrap">
        <img style={{width: '100%', height: '100%', objectFit: 'cover'}} src="https://i.seadn.io/gcs/files/b506eaca01f32365901c233181e69d93.png?auto=format&dpr=1&w=3840" />
        <div className="bg-wrap-mask"></div>
        <div className="bg-wrap-logo">
          <svg width="50" height="50" t="1722394375622" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4700"><path d="M512 0c282.766222 0 512 229.233778 512 512S794.766222 1024 512 1024 0 794.766222 0 512 229.233778 0 512 0zM285.297778 591.985778l219.591111 286.72V702.008889l-219.591111-109.966222v-0.056889z m453.404444 0l-220.444444 110.023111v176.810667l220.387555-286.72 0.056889-0.113778zM504.888889 123.107556L285.354667 575.431111l219.591111 115.655111V123.050667H504.888889v0.056889z m13.425778-0.170667v568.092444l220.387555-115.655111-220.444444-452.437333h0.056889z" fill="#546DCD" p-id="4701"></path></svg>
        </div>
        <div className="bg-wrap-searchbox">
          <svg fill="currentColor" height="24" role="img" viewBox="0 -960 960 960" width="24" xmlns="http://www.w3.org/2000/svg" aria-label="search"><title>Search</title><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"></path></svg>
          <input type="text" placeholder="Search" />
        </div>
        <div className="bg-wrap-account">
          <svg width="24" height="20" t="1722389612632" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2649"><path d="M687.206144 541.3888a300.9024 300.9024 0 0 0 120.4224-241.4592C807.628544 134.5536 674.969344 0 511.897344 0 348.825344 0 216.063744 134.5536 216.063744 299.9296c0 98.9696 47.5136 186.88 120.4224 241.4592C169.215744 611.5328 51.199744 778.752 51.199744 973.4656a46.592 46.592 0 0 0 46.2336 46.8992 46.592 46.592 0 0 0 46.2336-46.8992c0-206.08 165.2736-373.5552 368.3328-373.5552 203.0592 0 368.3328 167.5776 368.3328 373.5552a46.592 46.592 0 0 0 46.2336 46.8992 46.592 46.592 0 0 0 46.2336-46.8992c-0.1024-194.7136-118.272-361.984-285.5936-432.0768zM308.479744 299.9296c0-113.8176 91.2896-206.2848 203.4176-206.2848s203.4176 92.6208 203.4176 206.336c0 113.664-91.3408 206.2848-203.4176 206.2848-112.128 0-203.4176-92.6208-203.4176-206.336z" fill="#FFFFFF" p-id="2650"></path></svg>
          { shortAddress(account) }
        </div>
        <div className="bg-wrap-slogan">
          Discover, Trade, Own: Your Digital Collection Starts Here.
        </div>
      </div>
      <div className="main">
        <div className="main-tabs">
          <div onClick={() => { onTabChange(TAB_KEYS.TRENDING_NFTS) }} className={activeTabKey === TAB_KEYS.TRENDING_NFTS ? 'main-tabs-item active' : 'main-tabs-item'}>Trending NFTs</div>
          <div onClick={() => { onTabChange(TAB_KEYS.MY_NFTS) }} className={activeTabKey === TAB_KEYS.MY_NFTS ? 'main-tabs-item active' : 'main-tabs-item'}>My NFTs</div>
        </div>
        {
          TAB_KEYS.TRENDING_NFTS === activeTabKey ? (
            <div className="main-nftwrap">
              {
                mintedNFTs.length > 0 ? mintedNFTs.map(nft => {
                  return (
                    <NFT key={nft.id} nft={nft} isOwner={account === nft.account} />
                  )
                }) : ''
              }
            </div>
          ) : (
            <MyNFTs account={account} nftContractInstance={nftContractInstance} uris={uris} />
          )
        }
      </div>
    </div>
  );
};

export default App;
