import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./Ecommerce.scss"
import Web3Modal from "web3modal";
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../../constants";
import { Contract, parseEther } from "ethers";

import NFTLogo from '../NFTLogo/NFTLogo';


const BASE_URL = "http://localhost:8000";
const ethers = require("ethers")

export default function Ecommerce() {

    const [merchs, setMerch] = useState([]);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/merch/`)
            .then(response => {
                setMerch(response.data);
                Slider();
            })
            .catch(error => {
                console.error('Error fetching merch:', error);
            });
    }, []);

    return (
        <div>
            <Slider merchs={merchs} />
        </div>
    );
}

function Slider({ merchs }) {
    const [current, setCurrent] = useState(0);
    const items = merchs
    console.log(items)
    const totalItems = items.length;

    const navigate = (dir) => {
        items[current].className = '';

        if (dir === 'right') {
            setCurrent(current < totalItems - 1 ? current + 1 : 0);
        } else {
            setCurrent(current > 0 ? current - 1 : totalItems - 1);
        }

        const nextCurrent = current < totalItems - 1 ? current + 1 : 0;
        const prevCurrent = current > 0 ? current - 1 : totalItems - 1;

        items[current].className = 'current';
        items[prevCurrent].className = 'prev_slide';
        items[nextCurrent].className = '';
    };

    const handlePrevClick = () => {
        navigate('left');
    };

    const handleNextClick = () => {
        navigate('right');
    };

    const handleKeyDown = (ev) => {
        const keyCode = ev.keyCode || ev.which;
        switch (keyCode) {
            case 37:
                navigate('left');
                break;
            case 39:
                navigate('right');
                break;
            default:
                break;
        }
    };

    const handleTouchStart = (evt) => {
        const xDown = evt.touches[0].clientX;
        const yDown = evt.touches[0].clientY;

        return { xDown, yDown };
    };

    const handleTouchMove = (evt, xDown, yDown) => {
        if (!xDown || !yDown) {
            return;
        }

        const xUp = evt.touches[0].clientX;
        const yUp = evt.touches[0].clientY;

        const xDiff = xDown - xUp;
        const yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                navigate('right');
            } else {
                navigate('left');
            }
        }

        return { xDown: null, yDown: null };
    };

    return (
        <div className="cd-slider">
            <ul>
                {merchs.map((item, index) => (
                    <li key={item.id} className={index === current ? 'current' : index === current - 1 || (current === 0 && index === totalItems - 1) ? 'prev_slide' : ''}>
                        <h2 className="product--name">{item.product}</h2>
                        <div className="product--description">{item.productDescription}</div>
                        <div className="product--text">${item.price}</div>
                        <img className="image" src={item.image} alt={item.productName} />
                    </li>
                ))}
            </ul>
            {totalItems > 1 && (
                <nav className="nav_arrows">
                    <button className="prev" aria-label="Prev" onClick={handlePrevClick}></button>
                    <div className="counter">
                        <span>{current + 1}</span>
                        <span>{totalItems}</span>
                    </div>
                    <button className="next" aria-label="Next" onClick={handleNextClick}></button>
                </nav>
            )}
        </div>
    );
}

