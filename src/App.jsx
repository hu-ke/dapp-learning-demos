import React, { useEffect, useState } from 'react';
import { Tabs, Button, Form, Modal, Input } from 'antd';
import './App.css';
import Account from './components/Account';

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm();

  useEffect(() => {
  }, []);

  const createNFT = () => {
    setIsModalVisible(true)
  }

  const items = [
    {
      key: '1',
      label: 'Trending NFTs',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'My NFTs',
      children: (
        <div onClick={createNFT}>
          You don't have any NFTs, please <Button type="primary">create a NFT and deploy</Button>
        </div>
      ),
    }
  ];

  const onChange = () => {

  }

  const handleOk = () => {
    setIsModalVisible(false)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }


  return (
    <div className="App">
      <Account />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      <Modal 
        title="Create a NFT" 
        open={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        width={850}
        okText={'Create'}
      >
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input your price!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="cid-image" label="Paste your IPFS image link">
            <Input placeholder='https://ipfs.io/ipfs/bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4/welcome-to-IPFS.jpg'/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
