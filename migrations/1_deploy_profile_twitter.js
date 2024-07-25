const Profile = artifacts.require("Profile");
const Twitter = artifacts.require("Twitter");

module.exports = async function (deployer) {
  // 部署 Profile 合约
  await deployer.deploy(Profile);
  const profileInstance = await Profile.deployed()
  
  // 获取 Profile 合约的地址
  const profileAddress = profileInstance.address;
  console.log('profileAddress>>', profileAddress)
  // 部署 Twitter 合约，传入 Profile 合约的地址
  await deployer.deploy(Twitter, profileAddress);
};
