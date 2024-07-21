const DeFiContract = artifacts.require("DeFiContract");

contract("DeFiContract", (accounts) => {
  it("should allow deposits and withdrawals", async () => {
    const defi = await DeFiContract.deployed();
    const amount = web3.utils.toWei("1", "ether");

    // Deposit 1 ETH
    await defi.deposit({ from: accounts[0], value: amount });

    // Check balance
    let balance = await defi.getBalance({ from: accounts[0] });
    assert.equal(balance.toString(), amount);

    // Withdraw 1 ETH
    await defi.withdraw(amount, { from: accounts[0] });

    // Check balance again
    balance = await defi.getBalance({ from: accounts[0] });
    assert.equal(balance.toString(), "0");
  });
});
