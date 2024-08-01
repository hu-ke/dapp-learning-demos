import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import useAccountHook from './hooks/useAccountHook';
import { getMintedNFTs, updateNFTAccount } from './utils/http'
import MyNFTs from './pages/MyNFTs';
import { ethers } from 'ethers';
import MyNFTContract from './contracts/MyNFT.json'
import shortAddress from './utils/shortAddress'
import NFT from './components/NFT'
import { message } from 'antd';

const TAB_KEYS = {
  TRENDING_NFTS: '1',
  MY_NFTS: '2'
}

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [account] = useAccountHook()
  const [activeTabKey, setActiveTabKey] = useState(TAB_KEYS.TRENDING_NFTS)
  const [mintedNFTs, setMintedNFTs] = useState([])
  const [uris, setURIs] = useState([])
  const [nftContractInstance, setNFTContractInstance] = useState()
  const [provider, setProvider] = useState()
  const [isBuying, setIsBuying] = useState(false)
  const [currentBuyingNFT, setCurrentBuyingNFT] = useState()

  const buyNFT = async(nft) => {
    setIsBuying(true)
    setCurrentBuyingNFT(nft)
    const priceInWei = ethers.utils.parseEther(`${nft.price}`); // 将ETH转换为Wei
    console.log('priceInWei', priceInWei)
    let signer = await provider.getSigner() // equals to account
    console.log('signer', signer)
    let tokenId = await nftContractInstance.connect(signer).getTokenIdByTokenURI(nft.image)
    console.log('tokenId', tokenId)
    try {
      const transaction2 = await nftContractInstance.connect(signer).buyNFT(tokenId, { value: priceInWei });
      console.log('Transaction sent, waiting for confirmation...')
      await transaction2.wait();
      messageApi.success('transaction is successful.')
      let res = await updateNFTAccount(nft.id, account)
      console.log('res', res)
      fetchMintedNFTs()
      console.log('Transaction confirmed!')
    } catch(e) {
      console.error(e)
    } finally {
      setIsBuying(false)
    }
  }

  const onTabChange = (key) => {
    setActiveTabKey(key)
  }

  const fetchURIs = async() => {
    // const contractAddress = '0x5161Fb78ee6D113fBAEb325c18fA391b69D4AC06'
    const contractAddress = '0x0677E4Dd20De385a986eDA724E03395b6e7A7199' // sepolia test network address
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

  const doneMinting = (nft) => {
    fetchURIs()
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
      {contextHolder}
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
        <a className="bg-wrap-github" href="https://github.com/hu-ke" target="_blank">
          <svg t="1722435927944" width="60" height="40" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6475"><path d="M855.557 216.855c35.621-66.153-5.089-152.661-5.089-152.661-91.597 0-157.75 61.064-157.75 61.064-35.621-20.355-152.661-20.355-152.661-20.355s-117.04 0-152.661 20.355c0 0-66.153-61.064-157.75-61.064 0 0-40.71 86.508-5.089 152.661 0 0-81.419 76.331-50.887 239.169 28.691 153.018 162.838 193.371 249.346 193.371 0 0-35.621 30.532-30.532 81.419 0 0-50.887 30.532-101.774 10.177s-76.331-71.242-76.331-71.242-50.887-66.153-101.774-40.71c0 0-15.266 15.266 40.71 40.71 0 0 40.71 61.064 55.976 96.685 15.266 35.621 96.685 66.153 178.105 45.798v117.04s0 10.177-20.355 15.266-20.355 15.266-10.177 15.266H723.25c10.177 0 10.177-10.177-10.177-15.266-20.355-5.089-20.355-15.266-20.355-15.266v-117.04s0.447-61.03 0-81.419c-1.119-51.128-35.621-81.419-35.621-81.419 86.508 0 220.655-40.353 249.346-193.371 30.533-162.837-50.886-239.168-50.886-239.168z" fill="#FFFFFF" p-id="6476"></path></svg>
          hu-ke
        </a>
        <div className="bg-wrap-slogan">
          Discover, Trade, Own: Your Digital Collection Starts Here.
          <p style={{fontSize: '16px', fontStyle: 'italic'}}>
            <div style={{marginBottom: 4}}>Disclaimer:</div>
            This website is used for the generation and trading of NFT assets on the <span style={{color: 'orange'}}>Sepolia network</span>. All transactions and operations conducted on this platform are executed using Sepolia testnet ETH and do not affect or consume ETH on the Ethereum Mainnet. Please be aware that Sepolia is a test network, and any ETH used here is purely for testing purposes and has no real-world value. Ensure that you are aware of this distinction when interacting with our platform.
          </p>
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
                    <NFT 
                      key={nft.id} 
                      nft={nft} 
                      isOwner={account === nft.account} 
                      handleBuy={buyNFT}
                      isMinted={uris.includes(nft.image)}
                      isBuying={isBuying && currentBuyingNFT?.id === nft.id}
                    />
                  )
                }) : ''
              }
            </div>
          ) : (
            <MyNFTs account={account} nftContractInstance={nftContractInstance} uris={uris} doneMinting={doneMinting} />
          )
        }
      </div>
    </div>
  );
};

export default App;
