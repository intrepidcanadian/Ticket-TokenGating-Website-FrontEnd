import React from 'react';
import logo from '../../assets/banneredit.png';
import './NFTLogo.scss';

const NFTLogo = () => {
  return (
    <div className="nftlogo__container">
      <img className="nftlogo" src={logo} alt="raptors logo" />
      <h1 className="nftlogo__container--text">Raptors VIP Member</h1>
    </div>
  );
};

export default NFTLogo;