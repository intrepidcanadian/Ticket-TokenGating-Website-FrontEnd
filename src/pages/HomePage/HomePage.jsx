import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import WalletConnect from "../../components/WalletConnect/WalletConnect";
import React, {useState} from "react";

export default function HomePage() {

    const [connection, setConnection] = useState(false);


    return (
        <div>
            <Header />
            <WalletConnect  setConnection={setConnection} />
            <Footer />
        </div>
    )
}
