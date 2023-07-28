import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer"
import React, {useState} from "react";
import './HomePage.scss'
import MatrixRainRender from "../../components/MatrixRainRender/MatrixRainRender";
import logo from "../../assets/Logo/community.svg";
import {Link} from "react-router-dom";
import HeroBanner from "../../components/HeroBanner/HeroBanner";


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
                {/* <HeroBanner /> */}

            </div>
            <Footer />
        </div>
    )
}

                {/* <MatrixRainRender /> */}

           
{/*     
            <div className = "slideshow__container">
           
             </div> */}

             {/* <Link to = "/mint">
            <div className = "hero__banner">
                <div className = "hero__imgcontainer">
                <img className ="hero__imgcontainer-img" src = {logo} alt = "hero image" />
                </div>
                <h1>Grow Your Community</h1>
            </div>
            </Link> */}
