import React, { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import "../WalletConnect/WalletConnect.scss"
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../../constants";
import { Contract } from "ethers";

// import assets
import spinner from "../../assets/Logo/spinner.jpeg";

const ethers = require("ethers")

function WalletConnect() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const web3ModalRef = useRef();

  function renderBody() {
    console.log("walletConnected:", walletConnected);
    console.log("userAddress:", userAddress);

    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className="button">
          Connect to Your Wallet Through Metamask
        </button>
      );
    } else if (!!userAddress && walletConnected) {

      return (
        <div className="wallet__container">
          <div className="spinner__container">
            <img className="icon" src={spinner} alt="Spinner" />
          </div>
          <span className="wallet__container--address"> {userAddress.slice(0, 5)}...{userAddress.slice(-3)}
          </span>
        </div>
      );
    } else {
      console.log(!!userAddress)
      console.log(walletConnected)
      return "Loading";
    }
  }

  const connectWallet = async () => {

    try {

      let web3Provider = await getProviderOrSigner();
      const accounts = await web3Provider.listAccounts();

      console.log(accounts)

      if (accounts.length > 0) {
        const connecteduserAddress = accounts[0].address;
        setWalletConnected(true)
        setUserAddress(connecteduserAddress)
        console.log("Wallet Address:", connecteduserAddress);
      }

    } catch (error) {

      if (error.message === "User Rejected") {
        // User rejected the connection request - probably disconnected Metamask
        setWalletConnected(false);

      } else {
        // Other errors, handle them accordingly
        console.error("Error connecting wallet:", error);
      }
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // We need to gain access to provider/signer from Metamask
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.BrowserProvider(provider);

    console.log(web3Provider);
    // let balance = await utils.formatEther(web3Provider.getBalance("0x8DabF51501196a7700c97616bD82791cF31Ac685"))
    // console.log(balance)
    let balance2 = await web3Provider.getBalance("0x8DabF51501196a7700c97616bD82791cF31Ac685")
    let balance3 = ethers.formatEther(balance2)
    let network1 = await web3Provider.getNetwork(provider)
    let signer1 = await web3Provider.getSigner()
    // let example = await ethers.provider.getNetwork
    console.log(balance2)
    console.log(balance3)
    console.log(network1)
    console.log(signer1)
    // console.log(example)

    const { chainId, ensAddress, name } = await web3Provider.getNetwork();

    console.log("Current Chain ID:", chainId, ensAddress, name);

    //if the user is not on conflux, ask them to switch to conflux
    if (chainId !== 71n) {

      window.alert(`Please switch to the Conflux testnet network on your MetaMask Wallet. You are currently on chain ID ${chainId}`);

      throw new Error("Incorrect Network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      console.log(signer)

      return signer;
    }


    return web3Provider;

  };


  useEffect(() => {
    const initWeb3Modal = async () => {
      web3ModalRef.current = new Web3Modal({
        providerOptions: {},
        disableInjectedProvider: false,
      });

      // If the wallet is not connected or false, then it does connectwallet function and also if the presale is ended
      // This will display either the presale function or sale function. To add the presale function
      if (!walletConnected) {

        connectWallet();
        // onPageLoad();

      } else {

        // If the wallet is already connected, log the wallet address again
        getProviderOrSigner()
          .then((web3Provider) => web3Provider.listAccounts())
          .then((accounts) => {
            if (accounts.length > 0) {
              const connecteduserAddress = accounts[0].address;
              // const chainId = accounts[0].provider.network.chainId
              // let chainIdNetwork = accounts[0].network.chainId;

              console.log("Wallet Address (Already Connected):", connecteduserAddress);
            } else {
              console.warn("No accounts found in the wallet.");
            }
          })
          .catch((error) => {
            console.error("Error getting wallet address:", error);
          });
      }
    };

    initWeb3Modal();

  }, [walletConnected, userAddress]);


  return (
    <>
      {renderBody()}
    </>

  );

}

export default WalletConnect;
