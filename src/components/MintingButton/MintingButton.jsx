import "./MintingButton.scss";
import React, { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../../constants";
import { Contract, parseEther } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ethers = require("ethers")

function MintingButton() {

    const [walletConnected, setWalletConnected] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
    const [presaleStarted, setPresaleStarted] = useState(false);
    const [presaleEnded, setPresaleEnded] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const web3ModalRef = useRef();

    useEffect(() => {
        // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
        if (!walletConnected) {
            // Assign the Web3Modal class to the reference object by setting it's `current` value
            // The `current` value is persisted throughout as long as this page is open
            web3ModalRef.current = new Web3Modal({
                network: "conflux",
                providerOptions: {},
                disableInjectedProvider: false,
            });

            connectWallet();

            // get price of the NFT
            const _price = getPrice();

            // Check if presale has started and ended
            const _presaleStarted = checkIfPresaleStarted();
            if (_presaleStarted) {
                checkIfPresaleEnded();
            }

            getTokenIdsMinted();

            // Set an interval which gets called every 5 seconds to check presale has ended
            const presaleEndedInterval = setInterval(async function () {
                const _presaleStarted = await checkIfPresaleStarted();
                if (_presaleStarted) {
                    const _presaleEnded = await checkIfPresaleEnded();
                    if (_presaleEnded) {
                        clearInterval(presaleEndedInterval);
                    }
                }
            }, 5 * 1000);

            // set an interval to get the number of token Ids minted every 5 seconds
            setInterval(async function () {
                await getTokenIdsMinted();
            }, 5 * 1000);
        }
    }, [walletConnected]);

    const presaleMint = async () => {
        try {
            // We need a Signer here since this is a 'write' transaction.
            const signer = await getProviderOrSigner(true);
            // Create a new instance of the Contract with a Signer, which allows
            // update methods
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
            // call the presaleMint from the contract, only whitelisted addresses would be able to mint
            const tx = await nftContract.presaleMint({
                // value signifies the cost of one ticket which is "10" eth.
                // We are parsing `0.01` string to ether using the utils library from ethers.js
                value: parseEther("10"),
            });
            setLoading(true);
            // wait for the transaction to get mined
            await tx.wait();
            setLoading(false);
            window.alert("You successfully purchased a Raptors Playoff Ticket!");
            
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * publicMint: Mint an NFT after the presale
     */
    const publicMint = async () => {
        try {
            // We need a Signer here since this is a 'write' transaction.
            const signer = await getProviderOrSigner(true);
            // Create a new instance of the Contract with a Signer, which allows
            // update methods
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
            const tx = await nftContract.mint({
                // value signifies the cost of one raptors ticket which is "10" eth.
                // We are parsing `0.01` string to ether using the utils library from ethers.js
                value: parseEther("10"),
            });
            setLoading(true);
            // wait for the transaction to get mined
            await tx.wait();
            setLoading(false);

            window.alert("You successfully purchased a Raptors Playoff Ticket!");
            
            
        } catch (err) {
            console.error(err);
        }
    };


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

    const checkIfPresaleStarted = async () => {
        try {
            const provider = await getProviderOrSigner()
            const nftContract = new Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_CONTRACT_ABI,
                provider
            );

            const _presaleStarted = await nftContract.presaleStarted();
            setPresaleStarted(_presaleStarted);

            if (!_presaleStarted) {
                await getOwner();
            }
            setPresaleStarted(_presaleStarted);
            return _presaleStarted;

        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const getPrice = async () => {

        try {

            const provider = await getProviderOrSigner()
            const nftContract = new Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_CONTRACT_ABI,
                provider
            );

            const _price = await nftContract._price();
            const _priceNumber = ethers.formatEther(_price)
            setPrice(_priceNumber)

        } catch (error) { }
    }

    const checkIfPresaleEnded = async () => {
        try {

            const provider = await getProviderOrSigner()
            const nftContract = new Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_CONTRACT_ABI,
                provider
            );

            // THis will require a big number because of UIN256
            const _presaleEnded = await nftContract.presaleEnded();
            const _presaleEndedNumber = _presaleEnded
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);


            // this is true or false test. Ending is True if current time has passed the presale end time.
            const hasEnded = _presaleEndedNumber < currentTimeInSeconds;

            if (hasEnded) {
                setPresaleEnded(true);
            } else {
                setPresaleEnded(false);
            }
            return hasEnded;
        } catch (err) {
            console.error(err);
            return false;
        }
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


    const getTokenIdsMinted = async () => {
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // No need for the Signer here, as we are only reading state from the blockchain
            const provider = await getProviderOrSigner();
            // We connect to the Contract using a Provider, so we will only
            // have read-only access to the Contract
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
            // call the tokenIds from the contract
            const _tokenIds = await nftContract.tokenIds();
            //_tokenIds is a `Big Number`. We need to convert the Big Number to a string
            setTokenIdsMinted(_tokenIds.toString());
        } catch (err) {
            console.error(err);
        }
    };

    const renderButton = () => {
        // If wallet is not connected, return a button which allows them to connect their wallet
        if (!walletConnected) {
            return (
                <>
                    <div className="button__container">
                        <button onClick={connectWallet} className="button" >
                            Connect your Wallet to Check the Launch
                        </button>
                    </div>
                </>
            );
        }

        // If we are currently waiting for something, return a loading button
        if (loading) {
            return (<>
            <div className = "loadingcontainer--text">Loading...</div>
            </>)
        }

        // If connected user is the owner, and presale hasn't started yet, allow them to start the presale
        if (isOwner && !presaleStarted) {
            return (
                <>
                    <div className="button__container">
                        <button onClick={startPreSale} className="button">
                            Start Selling Your Tickets to VIP Raptor Members!
                        </button>
                    </div>
                </>
            );
        }

        // If connected user is not the owner but presale hasn't started yet, tell them that
        if (!presaleStarted) {
            return (
                <div className="button__container">
                    <h3> Early access for tickets hasn't started yet! Stay tuned for the Raptors & Lakers Game Ticket Sale!</h3>
                </div>
            );
        }

        // If presale started, but hasn't ended yet, allow for minting during the presale period
        if (presaleStarted && !presaleEnded) {
            return (
                <div className="button__container">
                    <div>
                        Presale has started for the Raptors & Lakers Championship Game! If you are Raptors VIP, you will be eligilbe to purchase a ticket! 🥳
                    </div>
                    <div className = "button__container--text">Tickets On Early Access Sale: {price} CFX</div>
                    <button onClick={presaleMint} className="button">
                        Early Access - Buy Ticket
                    </button>
                </div>
            );
        }

        // If presale started and has ended, it's time for public minting
        if (presaleStarted && presaleEnded) {


            return (
                <>
                    <div className="button__container">
                        <div className = "button__container--text">Tickets On Sale: {price} CFX </div>
                        <button onClick={publicMint} className="button">
                            Buy Ticket 
                        </button>
                    </div>
                </>
            );
        }
    };


    return (
        <>
            {renderButton()}

        </>
    );

}

export default MintingButton;










