const { expect } = require("chai");

describe("MyNFT", function () {
  it("Should mint and transfer an NFT", async function () {
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy();
    await myNFT.deployed();

    const [owner, addr1, addr2] = await ethers.getSigners();

    // Mint an NFT
    const mintTx = await myNFT.mintNFT(owner.address, "https://mytoken.com/token1");
    await mintTx.wait();

    expect(await myNFT.totalSupply()).to.equal(1);

    // Transfer the NFT
    const transferTx = await myNFT.transferNFT(owner.address, addr1.address, 1);
    await transferTx.wait();

    expect(await myNFT.ownerOf(1)).to.equal(addr1.address);
  });
});
