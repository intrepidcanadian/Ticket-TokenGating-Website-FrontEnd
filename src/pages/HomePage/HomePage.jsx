import React, { useEffect, useRef, useState } from 'react';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../../constants/index.js";

import Web3Modal from "web3modal";
import { Contract } from "ethers";

const ethers = require("ethers");

function HomePage() {
  
    const [walletConnected, setWalletConnected] = useState(false);
    const [joinedWhitelist, setJoinedWhitelist] = useState(false);
    const [loading, setLoading] = useState(false);
    const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
    const web3ModalRef = useRef();

    const getProviderOrSigner = async (needSigner = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
        const provider = await web3ModalRef.current.connect();

        // We plug the provider into ethers to create an instance of Web3Provider, which allows us to make calls to the blockchain
        const web3Provider = new ethers.BrowserProvider(provider);
    
        // If user is not connected to the Conflux network, let them know and throw an error
     
        if (needSigner) {
          const signer = web3Provider.getSigner();
          return signer;
        }
        return web3Provider;
      };
    
      /**
       * addAddressToWhitelist: Adds the current connected address to the whitelist
       */
      const addAddressToWhitelist = async () => {
        try {
          // We need a Signer here since this is a 'write' transaction.
          const signer = await getProviderOrSigner(true);
          // Create a new instance of the Contract with a Signer, which allows
          // update methods
          const whitelistContract = new Contract(
            WHITELIST_CONTRACT_ADDRESS,
            abi,
            signer
          );
          // call the addAddressToWhitelist from the contract
          const tx = await whitelistContract.addAddressToWhitelist();
          setLoading(true);
          // wait for the transaction to get mined
          await tx.wait();
          setLoading(false);
          // get the updated number of addresses in the whitelist
          await getNumberOfWhitelisted();
          setJoinedWhitelist(true);
        } catch (err) {
          console.error(err);
        }
      };
    
      /**
       * getNumberOfWhitelisted:  gets the number of whitelisted addresses
       */
      const getNumberOfWhitelisted = async () => {
        try {
          // Get the provider from web3Modal, which in our case is MetaMask
          // No need for the Signer here, as we are only reading state from the blockchain
          const provider = await getProviderOrSigner();
          // We connect to the Contract using a Provider, so we will only
          // have read-only access to the Contract
          const whitelistContract = new Contract(
            WHITELIST_CONTRACT_ADDRESS,
            abi,
            provider
          );
          // call the numAddressesWhitelisted from the contract
          const _numberOfWhitelisted =
            await whitelistContract.numAddressesWhitelisted();
          setNumberOfWhitelisted(_numberOfWhitelisted);
        } catch (err) {
          console.error(err);
        }
      };
    
      /**
       * checkIfAddressInWhitelist: Checks if the address is in whitelist
       */
      const checkIfAddressInWhitelist = async () => {
        try {
          // We will need the signer later to get the user's address
          // Even though it is a read transaction, since Signers are just special kinds of Providers,
          // We can use it in it's place
          const signer = await getProviderOrSigner(true);
          const whitelistContract = new Contract(
            WHITELIST_CONTRACT_ADDRESS,
            abi,
            signer
          );
          // Get the address associated to the signer which is connected to  MetaMask
          const address = await signer.getAddress();
          // call the whitelistedAddresses from the contract
          const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
            address
          );
          setJoinedWhitelist(_joinedWhitelist);
        } catch (err) {
          console.error(err);
        }
      };
    
      /*
        connectWallet: Connects the MetaMask wallet
      */
      const connectWallet = async () => {
        try {
          // Get the provider from web3Modal, which in our case is MetaMask
          // When used for the first time, it prompts the user to connect their wallet
          await getProviderOrSigner();
          setWalletConnected(true);
    
          checkIfAddressInWhitelist();
          getNumberOfWhitelisted();
        } catch (err) {
          console.error(err);
        }
      };
    
      /*
        renderButton: Returns a button based on the state of the dapp
      */
      const renderButton = () => {
        if (walletConnected) {
          if (joinedWhitelist) {
            return (
              <div>
                Thanks for joining the Whitelist!
              </div>
            );
          } else if (loading) {
            return <button>Loading...</button>;
          } else {
            return (
              <button onClick={addAddressToWhitelist}>
                Join the Whitelist
              </button>
            );
          }
        } 
      };
    
      // useEffects are used to react to changes in state of the website
      // The array at the end of function call represents what state changes will trigger this effect
      // In this case, whenever the value of `walletConnected` changes - this effect will be called
      useEffect(() => {
        // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
        if (!walletConnected) {
          // Assign the Web3Modal class to the reference object by setting it's `current` value
          // The `current` value is persisted throughout as long as this page is open
          web3ModalRef.current = new Web3Modal({
            network: "goerli",
            providerOptions: {},
            disableInjectedProvider: false,
          });
          connectWallet();
        }
      }, [walletConnected]);
    


    return (
        <div>
            <Header />
            <div className="appbody">
                <div className="appbody__header">
                    <h1 className="appbody__title">Token-Gating NFT Project</h1>
                </div>
          
            </div>
            <Footer />

        </div>
    );
}

export default HomePage;
