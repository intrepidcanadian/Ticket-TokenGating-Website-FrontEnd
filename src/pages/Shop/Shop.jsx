import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import React, {useState} from "react";
import './Shop.scss'


export default function Shop() {

    return (
        <div>
            <Header />
            <div className="appbody">
                <div className='appbody__header'>
                    <h1 className='appbody__title'>
                        Shop
                    </h1>
                </div>
            </div>
            <Footer />
        </div>
    )
}
