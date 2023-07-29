import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import React, {useState} from "react";
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
                    <MintingButton />
                </div>

            </div>
            <Footer />
        </div>
    )
}
