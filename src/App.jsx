import React, { useEffect } from 'react';
import { create } from '@web3-storage/w3up-client'

const App = () => {

  const handleFileChange = async(e) => {
    // @ts-ignore
    let file = e?.target?.files[0]
    console.log('file', file)
    const client = await create()
    await client.login('hu-ke@hotmail.com')
    await client.setCurrentSpace('did:key:z6MkgavdgRcmrjkXDt6HbKc5926cn8r3cqGFkG2JiWst4DBd')
    const directoryCid = await client.uploadFile(file)
    console.log('directoryCid', directoryCid)
  }

  useEffect(() => {
    const init = async() => {
      // console.log('init')
      // const client = await create()
      // // await client.authorize('hu-ke@hotmail.com')
      // console.log(client)
      // try {
      //   await client.login('hu-ke@hotmail.com')
      //   // await client.registerSpace('hu-ke@hotmail.com', { provider: 'did:key:z6MkgavdgRcmrjkXDt6HbKc5926cn8r3cqGFkG2JiWst4DBd' })
      //   await client.setCurrentSpace('did:key:z6MkgavdgRcmrjkXDt6HbKc5926cn8r3cqGFkG2JiWst4DBd')
      //   const file = new File(['testcss'], './index.css')
        
      //   const directoryCid = await client.uploadFile(file)
      //   console.log('directoryCid', directoryCid)
      // } catch (err) {
      //   console.error('registration failed: ', err)
      // }
    }
    init()
  }, []);

  return (
    <div className="App">
      <input type="file" id="fileInput" onChange={handleFileChange} />
    </div>
  );
};

export default App;
