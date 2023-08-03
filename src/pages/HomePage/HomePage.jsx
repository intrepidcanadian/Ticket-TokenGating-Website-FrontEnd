import React, { useEffect, useRef, useState } from 'react';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../../constants/index.js";

import Web3Modal from "web3modal";
import { Contract } from "ethers";
import "./HomePage.scss";
// import MatrixRainRender from '../../components/MatrixRainRender/MatrixRainRender';
import logo1 from "../../assets/logo1.png";
import logo2 from "../../assets/logo2.png";
import logo3 from "../../assets/logo3.png";
import logo4 from "../../assets/logo4.png";


const ethers = require("ethers");


function HomePage() {

    const [walletConnected, setWalletConnected] = useState(false);
    const [joinedWhitelist, setJoinedWhitelist] = useState(false);
    const [loading, setLoading] = useState(false);
    const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
    const [maxNumberOfWhitelisted, setMaxNumberOfWhitelisted] = useState(0);
    const web3ModalRef = useRef();


    const getProviderOrSigner = async (needSigner = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
        const provider = await web3ModalRef.current.connect();

        // We plug the provider into ethers to create an instance of Web3Provider, which allows us to make calls to the blockchain
        const web3Provider = new ethers.BrowserProvider(provider);
        console.log(web3Provider)

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
            const _whitelistedAddresses = await whitelistContract.numAddressesWhitelisted();
            const numberwhitelistedAddresses = Number(_whitelistedAddresses)

            const _maxwhitelistedAddresses = await whitelistContract.maxWhitelistedAddresses();
            const numbermaxwhitelistedAddresses = Number(_maxwhitelistedAddresses)

            setNumberOfWhitelisted(numberwhitelistedAddresses);
            setMaxNumberOfWhitelisted(numbermaxwhitelistedAddresses);
            console.log(numberOfWhitelisted)
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
                    <>
                        <div className="content__container">
                            <h3 className="content__container--header"> You are a Raptors VIP! Thanks for joining! You have early access to ticket sales </h3>
                        </div>
                        <div className="content__container">
                            <h3 className="content__container--text"> {numberOfWhitelisted} / {maxNumberOfWhitelisted} have joined. We are maxing early access tickets at {maxNumberOfWhitelisted}  </h3>
                        </div>


                    </>
                );
            } else if (loading) {
                return <button>Loading...</button>;
            } else {
                return (
                    <div className="button__container">
                        <button onClick={addAddressToWhitelist} className="button">
                            Join the Early Access for Ticket Sales
                        </button>
                    </div>
                );
            }
        } else {
            connectWallet()
        }
    };

    // useEffects are used to react to changes in state of the website
    // The array at the end of function call represents what state changes will trigger this effect
    // In this case, whenever the value of `walletConnected` changes - this effect will be called
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

            } else {

                // If the wallet is already connected, log the wallet address again
                getProviderOrSigner()
                    .then((web3Provider) => web3Provider.listAccounts())
                    .then((accounts) => {
                        if (accounts.length > 0) {
                            const connecteduserAddress = accounts[0].address;
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


    }, [walletConnected, joinedWhitelist, numberOfWhitelisted]);

    return (
        <div>
            <Header />
            <div className="appbody">
                <div className="appbody__header">
                    <h1 className="home__title">Be a Raptors VIP - Get Early Access to Playoff Ticket Sales</h1>
                </div>
                <div className="home__mastercontainer">
                    <h2 className="homn__container--text">Only Limited Early Access Spots - Connect Your Wallet to Check If Any Spots Remain!!</h2>
                </div>
                <div className="home__mastercontainer--logos">
                    <img className="icon--picture" src={logo1} alt="Logo1" />
                    <img className="icon--picture" src={logo2} alt="Logo2" />
                    <img className="icon--picture" src={logo3} alt="Logo3" />
                    <img className="icon--picture" src={logo4} alt="Logo4" />
                </div>
                <div>{renderButton()} </div>
            </div>
            <Footer />

        </div>
    );
}

export default HomePage;
