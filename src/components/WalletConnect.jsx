import React, { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import "./WalletConnect.css"

const ethers = require("ethers")

function WalletConnect() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  const connectWallet = async () => {

    try {
      await getProviderOrSigner();
      setWalletConnected(true);
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
    const { chainId } = await web3Provider.getNetwork();

    console.log("Current Chain ID:", chainId);

    //if the user is not on conflux, ask them to switch to conflux
    if (chainId !== 71n) {

      window.alert(`Please switch to the Conflux testnet network. This is currently on ${chainId}`);

      throw new Error("Incorrect Network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;

  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <h1>Crypto Devs NFT</h1>
      <div className="main">
        {walletConnected ? null : (
          <button onClick={connectWallet} className="button">
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default WalletConnect;
