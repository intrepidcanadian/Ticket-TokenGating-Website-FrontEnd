import React from 'react';
import logo from '../../assets/banneredit.png';
import './NFTLogo.scss';

const NFTLogo = () => {
  return (
    <div className="nftlogo__container">
      <img className="nftlogo" src={logo} alt="raptors logo" />
      <h4 className="nftlogo__container--text">15% Members' Discount</h4>
    </div>
  );
};

export default NFTLogo;