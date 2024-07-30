import React, { useEffect, useState } from 'react';
import { Tabs, Button, Form, Modal, Input, InputNumber, Card, message, Popconfirm } from 'antd';
import './App.css';
import Account from './components/Account';
import { deleteNFT, createNFT, getTrendingNFTs, getMyNFTs } from './utils/http'

const { Meta } = Card;

const TAB_KEYS = {
  TRENDING_NFTS: '1',
  MY_NFTS: '2'
}


const App = () => {
  const defaultIPFSImage = 'https://ipfs.io/ipfs/bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4/welcome-to-IPFS.jpg'
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm();
  const [account, setAccount] = useState()
  const [activeTabKey, setActiveTabKey] = useState(TAB_KEYS.TRENDING_NFTS)
  const [trendingNFTs, setTrendingNFTs] = useState([])
  const [myNFTs, setMyNFTs] = useState([])

  const showCreatingForm = () => {
    setIsModalVisible(true)
  }

  const clickDeleteNFT = async(nft) => {
    let res = await deleteNFT(nft)
    if (res.code === 200) {
      messageApi.success(res.msg)
      fetchMyNFTs()
    }
  }

  const items = [
    {
      key: TAB_KEYS.TRENDING_NFTS,
      label: 'Trending NFTs',
      children: (
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          {
            trendingNFTs.length > 0 ? trendingNFTs.map(nft => {
              return (
                <Card
                  actions={[
                    <Button type="primary">Buy</Button>,
                  ]}
                  hoverable
                  style={{ width: 260 }}
                  cover={<img alt="nft image" src={nft.image} />}
                >
                  <Meta title={nft.name} description={nft.description} />
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
        myNFTs.length > 0 ? (
          <div>
            {
              myNFTs.length > 0 ? myNFTs.map(nft => {
                return (
                  <Card
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
                      </Popconfirm>
                    ]}
                    hoverable
                    style={{ width: 260 }}
                    cover={<img alt="nft image" src={nft.image} />}
                  >
                    <Meta title={nft.name} description={nft.description} />
                  </Card>
                )
              }) : ''
            }  
          </div>
        ) : (
          <div onClick={showCreatingForm}>
            You don't have any NFTs, please <Button type="primary" disabled={!account}>create a NFT and deploy</Button>
          </div>
        )
      ),
    }
  ];

  const onChange = (key) => {
    setActiveTabKey(key)
  }

  const fetchTrendingNFTs = async() => {
    let res = await getTrendingNFTs()
    if (res.code === 200) {
      setTrendingNFTs(res.data)
    }
  }

  const fetchMyNFTs = async() => {
    let res = await getMyNFTs(account)
    if (res.code === 200) {
      setMyNFTs(res.data)
    }
  }

  useEffect(() => {
    if (activeTabKey === TAB_KEYS.TRENDING_NFTS) {
      fetchTrendingNFTs()
    } else {
      fetchMyNFTs()
    }
  }, [activeTabKey])

  const handleOk = async() => {
    try {
      await form.validateFields()
      let nft = form.getFieldsValue()
      if (!nft.image) {
        nft.image = defaultIPFSImage
      }
      let res = await createNFT(nft)
      if (res.code === 200) {
        messageApi.open({
          type: 'success',
          content: res.msg,
        });
        fetchMyNFTs()
      }
      setIsModalVisible(false)
    } catch(e) {
      console.error('form validation error', e)
    }
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onConnected = (account) => {
    setAccount(account)
  }

  useEffect(() => {
    if (account && isModalVisible && form) {
      form.setFieldValue('account', account)
    }
  }, [account, isModalVisible, form])

  return (
    <div className="App">
      {contextHolder}
      <Account onConnected={onConnected} />
      <Tabs activeKey={activeTabKey} items={items} onChange={onChange} />
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
    </div>
  );
};

export default App;
