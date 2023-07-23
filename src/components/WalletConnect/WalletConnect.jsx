import React, { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import "../WalletConnect/WalletConnect.scss"

const ethers = require("ethers")

function WalletConnect() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("")
  const [chainId, setChainId] = useState("")
  const web3ModalRef = useRef();

  const connectWallet = async () => {

    try {
      setWalletConnected(true);
      let web3Provider = await getProviderOrSigner();

      const accounts = await web3Provider.listAccounts();
      if (accounts.length > 0) {
        const userAddress = accounts[0];
        console.log("Wallet Address:", userAddress);
      }


    } catch (error) {

      if (error.message === "User Rejected") {
        // User rejected the connection request, handle it gracefully
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
    console.log(provider);

    const web3Provider = new ethers.BrowserProvider(provider);
    console.log(web3Provider);
    // Update wallet connected to be true
    const { chainId, ensAddress, name } = await web3Provider.getNetwork();

    console.log("Current Chain ID:", chainId, ensAddress, name);

    //if the user is not on conflux, ask them to switch to conflux
    if (chainId !== 71n) {

      window.alert(`Please switch to the Conflux testnet network on your MetaMask Wallet. You are currently on chain ID ${chainId}`);

      throw new Error("Incorrect Network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
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

      // Check if the wallet is already connected
      if (!walletConnected) {
        connectWallet();
      } else {

        // If the wallet is already connected, log the wallet address again
        getProviderOrSigner()
          .then((web3Provider) => web3Provider.listAccounts())
          .then((accounts) => {
            if (accounts.length > 0) {
              let userAddress = accounts[0].address;
              let chainId = accounts[0].chainId;
              setUserAddress(userAddress)
              setChainId(chainId)
              console.log("Wallet Address (Already Connected):", userAddress);
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
  }, [walletConnected]);

  return (
    <div>
      <div className="appbody">
        <div className='appbody__header'>
          <h1 className='appbody__title'>
            Conflux E-Commerce NFT Project
          </h1>
        </div>
        <p className="appbody__status">
          {walletConnected ?
            <>
              You are connected to Chain {chainId}. Your Conflux Testnet Address is 
              <span className="appbody__status--address"> {userAddress.slice(0, 5)}...{userAddress.slice(-3)} 
              </span>
            </>
            : `"Not Connected"`}
        </p>
        <div className="main">
          {walletConnected ? null : (
            <button onClick={connectWallet} className="button">
              Connect to Conflux TestNet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WalletConnect;
