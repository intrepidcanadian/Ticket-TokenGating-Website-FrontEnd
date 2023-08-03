import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import React, { useEffect, useState, useRef } from "react";
import './Tickets.scss'

import Web3Modal from "web3modal";
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../../constants";
import { Contract, parseEther } from "ethers";
import axios from 'axios';

const ethers = require("ethers")

export default function Tickets() {
    const BASE_URL = "http://localhost:8000";

    const [connectedAddress, setUserAddress] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [walletConnected, setWalletConnected] = useState(false);
    const web3ModalRef = useRef();
    const [ownersofnft, setOwnersOfNFT] = useState([]);
    const [ownedTicketIds, setOwnedTicketIds] = useState([]);
    
    useEffect(() => {
        // Fetch the list of tickets available
        axios.get(`${BASE_URL}/api/games/`)
            .then(response => {

                initWeb3Modal();
                ConnectWallet();
                nftOwned();
                setTickets(response.data);
                setOwnedTicketIds([]);
            })
            .catch(error => {
                console.error('Error fetching tickets:', error);
            });

    }, [connectedAddress]);

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
                const connectedUserAddress = accounts[0].address;
                setWalletConnected(true)
                setUserAddress(connectedUserAddress)
                console.log("Wallet Address:", connectedUserAddress);
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
            const signer = await getProviderOrSigner(false);
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
            let issuedtokenids = await nftContract.tokenIds();
            let issuedtokenidsformat = issuedtokenids.toLocaleString();

            setOwnersOfNFT([]);
            setOwnedTicketIds([]);

            async function fetchOwners() {
                for (let i = 1; i <= issuedtokenidsformat; i++) {
                    console.log(i);
                    const ownerofnftID = await nftContract.ownerOf(i);
                    
                    setOwnersOfNFT(owners => [...owners, ownerofnftID]);

                    console.log(ownerofnftID);

                    if (ownerofnftID === connectedAddress) {
                        
                        setOwnedTicketIds(ids => [...ids, i]);
                        console.log(ownedTicketIds);
                    }
                }
            }

            // Call the fetchOwners function to populate the ownersofnft array
            await fetchOwners();
      
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
                        View Your Tickets
                    </h1>

                </div>
                <div className="appbody__content">
                    <div className="appbody__table">
                        <div className="appbody__table--piclabels">
                            <p className="appbody__table--labels"></p>
                        </div>
                        <p className="appbody__table--labels">Event</p>
                        <p className="appbody__table--labels">Location</p>
                        <p className="appbody__table--labels">Time Start</p>
                    </div>

                    {tickets.map(ticket => (
                        <div key={ticket.id}>
                            {/* This is a ticket {ticket.id}
                            {ownedTicketIds}
                            {ownedTicketIds.includes(ticket.id) ? "True" : "False"} */}
                             {ownedTicketIds.includes(ticket.id) &&  (
                            <div className="appbody__mastercontainer">
                                <div className="appbody__container">
                                    <div className="appbody__imgcontainer">
                                        <img className="appbody__imgcontainer--image" src={ticket.image} alt={ticket.eventname} />
                                        <div className="appbody__imgcontainer--overlay">
                                            <p className="appbody__imgcontainer--textartist">{ticket.artist}</p>
                                            <p className="appbody__imgcontainer--text">Seat #: {ticket.seat}</p>
                                        </div>
                                    </div>
                                    <p className="appbody__container--info">{ticket.eventname}</p>
                                    <p className="appbody__container--info">{ticket.location}</p>
                                    <p className="appbody__container--time">{new Date(ticket.eventtimestart).toLocaleString(undefined, { hour12: true })}</p>
                                    {/* <p className="appbody__container--time">{new Date(ticket.eventtimeend).toLocaleString(undefined,{hour12:true})}</p> */}
                                </div>
                                <p className="appbody__container--descriptioninfo">Token Id: {ticket.id}. {ticket.eventinformation}</p>
                            </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )

}
