import React from 'react';
import './NFT.css';
import shortAddress from '../utils/shortAddress';
import { Popconfirm, Button } from 'antd';

function NFT({ nft, isOwner, isMinted, handleDelete, handleMint, handleBuy, isMinting, isBuying }) {
  return (
    <article className="nft-item">
      <div className="nft-item-imgwrap">
      {/* <img className="nft-item-img" src="https://i.seadn.io/gcs/files/826927715dc6bfe4760349751066f873.png?auto=format&dpr=1&w=384" /> */}
        <img className="nft-item-img" src={nft.image} />
      </div>
      <div className="nft-item-name">{nft.name}</div>
      <div className="nft-item-description">{nft.description}</div>
      <div className="nft-item-price">{nft.price} ETH</div>
      <div className="nft-item-owner">Owner: {shortAddress(nft.account)}</div>
      <div className="nft-item-actions">
        {
          !isOwner ? (<div className="nft-item-actions-btn buy" onClick={() => { handleBuy(nft) }}><Button loading={isBuying} disabled={isBuying} type="link" style={{color: '#fff', fontWeight: 600}}>Buy</Button></div>) : (
            <>
              {
                isMinted ? '' : (
                  <Popconfirm
                    title="Delete the NFT"
                    description="Are you sure to delete this NFT?"
                    onConfirm={() => {
                      handleDelete(nft)
                    }}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <div className="nft-item-actions-btn delete">Delete</div>
                  </Popconfirm>
                )
              }
              {
                isMinted ? (<div className="nft-item-actions-btn minted">Minted</div>) : (<div className="nft-item-actions-btn mint" onClick={() => { handleMint(nft) }}><Button loading={isMinting} disabled={isMinting} type="link" style={{color: '#fff', fontWeight: 600}}>Mint</Button></div>)
              }
            </>
          )
        }
      </div>
    </article>
  );
}

export default NFT;
