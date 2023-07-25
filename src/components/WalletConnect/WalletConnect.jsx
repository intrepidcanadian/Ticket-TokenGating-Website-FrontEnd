import React, { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import "../WalletConnect/WalletConnect.scss"
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../../constants";
// import { Contract } from "ethers";

// import assets
import spinner from "../../assets/Logo/spinner.jpeg";

const ethers = require("ethers")

function WalletConnect() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [chainId, setChainId] = useState("");
  const web3ModalRef = useRef();

  const [isOwner, setIsOwner] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);

  // // Make it so only the owner can start the contract
  // const getOwner = async () => {
  //   try {
  //     const signer = await getProviderOrSigner();

  //     const nftContract = new Contract(
  //       NFT_CONTRACT_ADDRESS,
  //       NFT_CONTRACT_ABI,
  //       signer
  //     );

  //     // compares owner of the contract address and the useraddress to render a button for owner
  //     const owner = await nftContract.owner();
  //     const userAddress = await signer.getAddress();

  //     if (owner.toLowerCase() === userAddress.toLowerCase()) {
  //       setIsOwner(true);
  //       // Owner is connected to website, to render a button for Owner
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const checkIfOwner = async () => {
  //   try {
  //     const signer = await getProviderOrSigner();
  //     const nftContract = new Contract(
  //       NFT_CONTRACT_ADDRESS,
  //       NFT_CONTRACT_ABI,
  //       signer
  //     );

  //     const owner = await nftContract.owner();
  //     const userAddress = await signer.getAddress();

  //     if (owner.toLowerCase() === userAddress.toLowerCase()) {
  //       setIsOwner(true);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  // //callable only by owner of the contract

  // const startPreSale = async () => {

  //   try {
  //     const signer = await getProviderOrSigner(true);
  //     const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
  //     const txn = await nftContract.startPresale();
  //     await txn.wait();

  //     setPresaleStarted(true);

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const checkifPresaleStarted = async () => {
  //   try {
  //     const provider = await getProviderOrSigner()
  //     const nftContract = new Contract(
  //       NFT_CONTRACT_ABI,
  //       NFT_CONTRACT_ADDRESS,
  //       provider
  //     );

  //     const isPresaleStarted = await nftContract.presaleStarted();
  //     setPresaleStarted(isPresaleStarted);

  //     return isPresaleStarted;

  //   } catch (error) {
  //     console.error(error);
  //     return false;
  //   }
  // };

  // const checkifPresaleEnded = async () => {
  //   try {

  //     const provider = await getProviderOrSigner()
  //     const nftContract = new Contract(
  //       NFT_CONTRACT_ADDRESS,
  //       NFT_CONTRACT_ABI,
  //       provider
  //     );

  //     // THis will require a big number because of UIN256
  //     const presaleEndTime = await nftContract.presaleEnded();
  //     const currentTimeInSeconds = Date.now() / 1000;

  //     // this is true or false test. Ending is True if current time has passed the presale end time.
  //     const hasPresaleEnded = presaleEndTime.lt(
  //       Math.floor(currentTimeInSeconds)
  //     );

  //     setPresaleEnded(hasPresaleEnded)
  //   } catch (error) {
  //     console.error(error)
  //   }

  // }


  // const onPageLoad = async () => {
  //   await connectWallet();
  //   const presaleStarted = await checkifPresaleStarted();
  //   if (presaleStarted) {
  //     await checkifPresaleEnded();
  //   }

  // }


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
              let chainId = accounts[0].chainId;
              setUserAddress(connecteduserAddress)
              setChainId(chainId)
              setWalletConnected(true)
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
          <div className = "spinner__container">
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


  return (
    <div className="wallet__container">
      <p>
        {renderBody()}
      </p>
    </div>
  );
}

export default WalletConnect;
