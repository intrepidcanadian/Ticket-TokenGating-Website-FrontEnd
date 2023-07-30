import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import React from "react";
import './MintYourToken.scss'
import MintingButton from "../../components/MintingButton/MintingButton";

export default function MintYourToken() {

    return (
        <div>
            <Header />
            <div className="appbody">
                <div className='appbody__header'>
                    <h1 className='appbody__title'>
                        Mint Your Token
                    </h1>
                </div>
                <div className='appbody__body'>
                <div className = "appbody__content">
                     <MintingButton />
                </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}
