import "./MintingButton.scss";
import React, { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import "../WalletConnect/WalletConnect.scss"
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../../constants";
import { Contract } from "ethers";
const ethers = require("ethers")

function MintingButton() {

    const [walletConnected, setWalletConnected] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [presaleStarted, setPresaleStarted] = useState(false);
    const [presaleEnded, setPresaleEnded] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const web3ModalRef = useRef();

    useEffect(() => {
        const initWeb3Modal = async () => {
            web3ModalRef.current = new Web3Modal({
                providerOptions: {},
                disableInjectedProvider: false,
            });

        connectWallet();
 

            if (!walletConnected) {
                return (
                    <>
                    </>
                );
                
            }
            if (walletConnected) {
                console.log(walletConnected);
                getOwner();
                buttonAvailability();
            }

        };

        initWeb3Modal();}, [walletConnected, userAddress, isOwner]);


    const connectWallet = async () => {

        try {

            let web3Provider = await getProviderOrSigner();
            const accounts = await web3Provider.listAccounts();

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

        if (needSigner) {
            const signer = web3Provider.getSigner();
            console.log(signer)

            return signer;
        }

        return web3Provider;

    };

   

    // Make it so only the owner can start the contract
    const getOwner = async () => {
        try {
            const provider = await getProviderOrSigner(false);
            console.log(provider)

            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);

            console.log(nftContract)

            // compares owner of the contract address and the useraddress to render a button for owner
            const owner = await nftContract.owner();
            // get the signer
            const signer = await getProviderOrSigner(true);
            const userAddress = await signer.getAddress();

            console.log(signer)
            console.log(owner)
            console.log(userAddress)

            if (owner.toLowerCase() === userAddress.toLowerCase()) {
                setIsOwner(true);

                // Owner is connected to website, to render a button for Owner
            }
        } catch (error) {
            console.error('err', error);
        }
    };

    //callable only by owner of the contract

    const startPreSale = async () => {

        try {
            const signer = await getProviderOrSigner(true);
            console.log(signer)
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);

            const txn = await nftContract.startPresale();
            console.log(txn)
            await txn.wait();

            console.log(txn)
            setPresaleStarted(true);

        } catch (error) {
            console.error(error);
        }
    };

    const checkifPresaleStarted = async () => {
        try {
            const provider = await getProviderOrSigner()
            const nftContract = new Contract(
                NFT_CONTRACT_ABI,
                NFT_CONTRACT_ADDRESS,
                provider
            );

            const isPresaleStarted = await nftContract.presaleStarted();
            setPresaleStarted(isPresaleStarted);
            console.log(isPresaleStarted)

            return isPresaleStarted;

        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const checkifPresaleEnded = async () => {
        try {

            const provider = await getProviderOrSigner()
            const nftContract = new Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_CONTRACT_ABI,
                provider
            );

            // THis will require a big number because of UIN256
            const presaleEndTime = await nftContract.presaleEnded();
            const currentTimeInSeconds = Date.now() / 1000;

            // this is true or false test. Ending is True if current time has passed the presale end time.
            const hasPresaleEnded = presaleEndTime.lt(
                Math.floor(currentTimeInSeconds)
            );

            setPresaleEnded(hasPresaleEnded)
        } catch (error) {
            console.error(error)
        }

    }





    function buttonAvailability() {

        if (!walletConnected) {
            console.log(!walletConnected)
            return (
                console.log("Wallet is not connected for Pre-Sale")
            );
        }

        if (isOwner && !presaleStarted) {
            // render a button to start the presale
            console.log(isOwner)
            console.log(!presaleStarted)
            return (
                <button onClick={startPreSale} className="button">
                    Start the Pre-Sale
                </button>
            );
        }

        if (!presaleStarted) {
            console.log(!presaleStarted)
            // just say presale hasn't started yet, come back later
        }

        if (presaleStarted && !presaleEnded) {
            console.log(!presaleStarted)
            console.log(!presaleEnded)

            // allow users to mint in presale
        }

        if (presaleEnded) {
            console.log(presaleEnded)

            // allow users to take part in public sale
        }


    }


    return (
        <>
        {buttonAvailability()}
        </>
    );

}

export default MintingButton;










