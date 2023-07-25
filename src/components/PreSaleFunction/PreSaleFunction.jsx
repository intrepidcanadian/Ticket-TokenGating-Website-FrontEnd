import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../../constants";
import { ethers, Contract, provider } from "ethers";
import { useState } from "react"; // Don't forget to import useState

export default function PreSaleFunction() {
    const [isOwner, setIsOwner] = useState(false);
    const [presaleStarted, setPresaleStarted] = useState(false);
    const [presaleEnded, setPresaleEnded] = useState(false);
    const web3ModalRef = useRef();
    const [walletConnected, setWalletConnected] = useState(false);


    // Make it so only the owner can start the contract
    const getOwner = async () => {
        try {
            const signer = await getProviderOrSigner();

            const nftContract = new Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_CONTRACT_ABI,
                signer
            );

            // compares owner of the contract address and the useraddress to render a button for owner
            const owner = await nftContract.owner();
            const userAddress = await signer.getAddress();

            if (owner.toLowerCase() === userAddress.toLowerCase()) {
                setIsOwner(true);
                // Owner is connected to website, to render a button for Owner
            }
        } catch (error) {
            console.error(error);
        }
    };

    const checkIfOwner = async () => {
        try {
            const signer = await getProviderOrSigner();
            const nftContract = new Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_CONTRACT_ABI,
                signer
            );

            const owner = await nftContract.owner();
            const userAddress = await signer.getAddress();

            if (owner.toLowerCase() === userAddress.toLowerCase()) {
                setIsOwner(true);
            }
        } catch (error) {
            console.error(error);
        }
    };


    //callable only by owner of the contract

    const startPreSale = async () => {

        try {
            const signer = await getProviderorSigner(true);
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
            const txn = await nftContract.startPresale();
            await txn.wait();

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
        } catch (error) {
            console.error(error);
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

}
