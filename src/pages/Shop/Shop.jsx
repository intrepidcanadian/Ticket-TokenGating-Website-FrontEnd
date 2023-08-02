import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import React, { useEffect, useState, useRef } from "react";
import './Shop.scss'
import Web3Modal from "web3modal";
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../../constants";
import { Contract, parseEther } from "ethers";
import axios from 'axios';
import NFTLogo from "../../components/NFTLogo/NFTLogo";


const ethers = require("ethers")



export default function Shop() {
    const BASE_URL = "http://localhost:8000";
    const [connectedAddress, setUserAddress] = useState([]);
    const [walletConnected, setWalletConnected] = useState(false);
    const web3ModalRef = useRef();
    const [ownersofnft, setOwnersOfNFT] = useState([]);

    const [merchs, setMerch] = useState([]);

    useEffect(() => {
        // Fetch the list of tickets available
        axios.get(`${BASE_URL}/api/merch/`)
            .then(response => {
                setMerch(response.data);
                initWeb3Modal();
                ConnectWallet();
                nftOwned();
            })
            .catch(error => {
                console.error('Error fetching merch:', error);
            });
    }, []);

    const initWeb3Modal = async () => {
        web3ModalRef.current = new Web3Modal({
            providerOptions: {},
            disableInjectedProvider: false,
        })
    };


    const ConnectWallet = async () => {
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

    const nftOwned = async () => {
        try {
            const signer = await getProviderOrSigner(false); // Assuming this function returns a signer
            console.log(signer);
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);

            let issuedtokenids = await nftContract.tokenIds();
            let issuedtokenidsformat = issuedtokenids.toLocaleString();
            let ownersofnft = [];

            console.log(issuedtokenids);
            console.log(ownersofnft);

            async function fetchOwners() {
                for (let i = 1; i <= issuedtokenidsformat; i++) {
                    const ownerofnftID = await nftContract.ownerOf(i);
                    console.log(ownerofnftID)
                    ownersofnft.push(ownerofnftID);
                    setOwnersOfNFT(ownersofnft);
                }
            }

            // Call the fetchOwners function to populate the ownersofnft array
            await fetchOwners();

            // Now you can access the ownersofnft array
            console.log(ownersofnft);
        } catch (error) {
            console.error("Error:", error);
        }
      };


    return (
        <div>
            <Header />
            <div className="appbody">
                <div className='appbody__header'>
                    <h1 className='appbody__title'>
                        Exclusive Merch
                    </h1>
                    {ownersofnft.includes(connectedAddress) ? (
                    <NFTLogo />) : null}
                </div>
                <div className="appbody__content">
                    <div className="appbody__container--productstitle">
                        <p className="appbody__container--products">Products</p>
                        <p className="appbody__container--products">Price</p>
                        {ownersofnft.includes(connectedAddress) ? (
                            <p className="appbody__container--products">VIP Price</p>) : null}
                    </div>

                    {merchs.map(merch => (
                        <div key={merch.id}>
                            <div className="appbody__container--commerce">
                                {/* <p>{merch.product}</p> */}
                                <p className="appbody__container--products">{merch.productName}</p>
                                {/* <p>{merch.productDescription}</p> */}
                                {/* <p>{merch.productMaterial}</p> */}
                                <p className="appbody__container--price">${(merch.price).toFixed(2)}</p>
                                {ownersofnft.includes(connectedAddress) ? (
                                    <p className="appbody__container--discountprice">
                                        ${(merch.price * 0.85).toFixed(2)}
                                    </p>) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )

}
