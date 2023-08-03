import "./Header.scss";
import WalletConnect from "../WalletConnect/WalletConnect";

// Dependnancies
import { NavLink, useNavigate  } from "react-router-dom";
import {useState} from "react";

// Assets
import logo from "../../assets/banneredit.png";

export default function Header() {

  const navigate = useNavigate ();

  const handleNavLinkClick = (path) => {
    navigate(path);
    };

  return (
    <header className="header">
      <div className="header__logo-container">
        <NavLink
          to="/"
          className="no_underline"
        >
          <img className = "header__logo" src={logo} alt="Logo" />
        </NavLink>
      </div>
      <div className="header__links">
      <div className="header__link-container">
          <NavLink
            to="/"
            className="header__link"
            onClick={() => handleNavLinkClick("/")}
          >
            <p className = "header__link--title">Join the Raptors VIP List</p>
          </NavLink>
        </div>
        <div className="header__link-container">
          <NavLink
            to="/buy-tickets"
            className="header__link"
            onClick={() => handleNavLinkClick("/buy-tickets")}
          >
           <p className = "header__link--title"> Purchase Tickets </p>
          </NavLink>
        </div>
        <div className="header__link-container">
          <NavLink
            to="/tickets"
            className="header__link"
            onClick={() => handleNavLinkClick("/tickets")}
          >
            <p className = "header__link--title"> Ticket You Own </p>
          </NavLink>
        </div>
        <div className="header__link-container">
          <NavLink
            to="/owner"
            className="header__link"
            onClick={() => handleNavLinkClick("/owners")}
          >
            <p className = "header__link--title"> Our Ticket Owners </p>
          </NavLink>
        </div>
        
        <div className="header__link-container">
          <NavLink
            to="/shop"
            className="header__link"
            onClick={() => handleNavLinkClick("/shop")}
          >
            <p className = "header__link--title"> Merch Available </p>
          </NavLink>
        </div>
        <div className="header__link-container">
        <WalletConnect />
        </div>
      </div>
    </header>
  );
}
