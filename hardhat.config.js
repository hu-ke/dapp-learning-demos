// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        // 将 Ganache 中的私钥添加到此处
        // 例如：'0x<YOUR_GANACHE_ACCOUNT_PRIVATE_KEY>'
        '0xfde7c95a354e5e5f6aa7caabd3e24ed5d9480f93122723a619c74dd36ce0ad7f',
        // 其他私钥...
      ],
    },
  },
};
