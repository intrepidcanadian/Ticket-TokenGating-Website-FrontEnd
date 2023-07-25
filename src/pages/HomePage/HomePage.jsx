import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import React, {useState} from "react";
import './HomePage.scss'



export default function HomePage() {

    return (
        <div>
            <Header />
            <div className="appbody">
                <div className='appbody__header'>
                    <h1 className='appbody__title'>
                        Token-Gating NFT Project
                    </h1>
                </div>
            </div>
            <Footer />
        </div>
    )
}
