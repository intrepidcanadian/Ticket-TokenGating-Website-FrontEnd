const hre = require("hardhat");
require("dotenv").config({ path: ".env" });
const { newWhitelist_address, METADATA_URL } = require("../constants");

async function main() {
  // Address of the whitelist contract that you deployed in the previous module
  const whitelistContract = newWhitelist_address;
  // URL from where we can extract the metadata for a Raptors NFT. The Url I generated using my github page where i will be grabbing images
  const metadataURL = METADATA_URL;
  /*
  DeployContract in ethers.js is an abstraction used to deploy new smart contracts,
  so cryptoDevsContract here is a factory for instances of our CryptoDevs contract.
  */

 // here we deploy the contract
 const cryptoDevsContract = await hre.ethers.deployContract("RaptorTickets", [
   metadataURL,
   whitelistContract
 ]);

 // wait for the contract to deploy
 await cryptoDevsContract.waitForDeployment();

 // print the address of the deployed contract
 console.log("Raptors Contract Address:", cryptoDevsContract.target);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });