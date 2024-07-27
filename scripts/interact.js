async function main() {
    const [deployer] = await ethers.getSigners();
  
    const Token = await ethers.getContractFactory("MyNFT");
    const token = await Token.attach("0x40f50F4f64252E365b7f71cB65a28F949a4C2828"); // Your_Deployed_Contract_Address_Here
  
    console.log("Token name:", await token.name());
    console.log("Token symbol:", await token.symbol());
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  