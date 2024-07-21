const DeFiContract = artifacts.require("DeFiContract");

module.exports = function (deployer) {
  deployer.deploy(DeFiContract);
};
