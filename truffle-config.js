module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    }
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0", // 使用你所需的 Solidity 版本
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
  // 指定合约构建文件保存的目录
  contracts_build_directory: "./src/contracts",
};
