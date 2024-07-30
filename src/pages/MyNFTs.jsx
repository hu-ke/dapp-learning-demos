import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Button, Form, Modal, Input, InputNumber, Card, message, Popconfirm } from 'antd';
import { deleteNFT, createNFT, getMyNFTs } from '../utils/http'
import { ethers } from 'ethers';

const MyNFTs = forwardRef(({account, nftContractInstance, uris}, ref) => {
  const [messageApi, contextHolder] = message.useMessage();
  // const defaultIPFSImage = 'https://ipfs.io/ipfs/bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4/welcome-to-IPFS.jpg'
  const defaultIPFSImage = 'https://ipfs.io/ipfs/bafkreia3znv3i64sbqcsqfrpnsaeubaa4mpgwiq27w53mn4orzmz34dr6u'
  const [myNFTs, setMyNFTs] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm();

  const mintNFT = async(nft) => {
    if (!nft) {
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let signer = await provider.getSigner() // equals to account
    console.log('nft.image', nft.image)
    try {
      let transaction = await nftContractInstance.connect(signer).mint(nft.image)
      console.log('transaction', transaction)
      await transaction.wait()
    } catch(e) {
      console.error('mint error', e)
    }
  }

  const showCreatingForm = () => {
    setIsModalVisible(true)
  }

  // 使用 useImperativeHandle 来自定义暴露给父组件的实例值
  useImperativeHandle(ref, () => ({
    refresh: () => {
      fetchMyNFTs()
    }
  }));

  const fetchMyNFTs = useCallback(async() => {
    if (!account) {
      return
    }
    let res = await getMyNFTs(account)
    if (res.code === 200) {
      setMyNFTs(res.data)
    }
  }, [account])

  useEffect(() => {
    fetchMyNFTs()
  }, [])

  const clickDeleteNFT = async(nft) => {
    let res = await deleteNFT(nft)
    if (res.code === 200) {
      messageApi.success(res.msg)
      fetchMyNFTs()
    }
  }

  useEffect(() => {
    if (account && isModalVisible && form) {
      form.setFieldValue('account', account)
    }
  }, [account, isModalVisible, form])

  const handleOk = async() => {
    try {
      await form.validateFields()
      let nft = form.getFieldsValue()
      if (!nft.image) {
        nft.image = defaultIPFSImage
      }
      let res = await createNFT(nft)
      console.log('res',res)
      if (res.code === 200) {
        messageApi.open({
          type: 'success',
          content: res.msg,
        });
        fetchMyNFTs()
        mintNFT(nft)
        setIsModalVisible(false)
      } else if (res.code === 400) {
        messageApi.open({
          type: 'error',
          content: res.msg,
          duration: 5
        })
      }
    } catch(e) {
      console.error('form validation error', e)
    }
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <section>
      {contextHolder}
      {
        myNFTs.length > 0 ? (
          <>
            <p><Button onClick={showCreatingForm} type="primary" disabled={!account}>create a NFT</Button></p>
            <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
              {
                myNFTs.map(nft => {
                  return (
                    <Card
                      key={nft.id}
                      actions={[
                        <Popconfirm
                          title="Delete the NFT"
                          description="Are you sure to delete this NFT?"
                          onConfirm={() => {
                            clickDeleteNFT(nft)
                          }}
                          onCancel={() => {}}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button danger>Delete</Button>
                        </Popconfirm>,
                        
                        uris.includes(nft.image) ? (
                          <Button disabled type="text">Minted</Button>
                        ) : (
                          <Button type="primary" onClick={() => {
                            mintNFT(nft)
                          }}>Mint</Button>
                        )
                      ]}
                      hoverable
                      style={{ width: 260 }}
                      styles={{
                        body: {
                          padding: 10
                        }
                      }}
                      cover={<img alt="nft image" src={nft.image} />}
                    >
                      <h2 style={{margin: 0}}>{nft.name}</h2>
                      <div>{nft.description}</div>
                      <div>price: {nft.price} ETH</div>
                    </Card>
                  )
                })
              }
            </div>
          </>
        ) : (
          <div onClick={showCreatingForm}>
            You don't have any NFTs, please <Button type="primary" disabled={!account}>create a NFT</Button>
          </div>
        )
      }
      <Modal 
        title="Create a NFT" 
        open={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        width={850}
        okText={'Create'}
      >
        <Form form={form} layout="vertical" name="nftForm">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input your price!' }]}>
            <InputNumber min={0.00001} addonAfter='NFT' />
          </Form.Item>
          <Form.Item name="image" label="Paste your IPFS image link">
            <Input placeholder={defaultIPFSImage} />
          </Form.Item>
          <Form.Item name="account" label="Account" hidden={true}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
})

export default MyNFTs;
