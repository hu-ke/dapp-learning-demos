const HDWalletProvider = require('@truffle/hdwallet-provider');
// 对应sepolia网络上的测试账号，在设置中的“Reveal Secret Recovery Phrase”查看
const mnemonic = 'light vote noble copper drink winter congress scrap smile valley enable smile';

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    sepolia: {
      provider: () => new HDWalletProvider({
        privateKeys: ['c6cf1dbfa6d0bf8d57b76d671f1020f711d430e0d6c9e15a00996b5f92705603'],
        providerOrUrl:  `https://sepolia.infura.io/v3/46b96397d2ae4d36838227f9edbbd676`
      }),
      network_id: 11155111, // Sepolia网络ID
      // gas: 5500000,
      // confirmations: 2,
      // timeoutBlocks: 200,
      // skipDryRun: true
    }
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19",      // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
  // 指定合约构建文件保存的目录
  contracts_build_directory: "./src/contracts",
};
