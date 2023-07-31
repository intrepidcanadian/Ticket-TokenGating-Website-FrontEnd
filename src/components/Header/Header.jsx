import "./Header.scss";
import WalletConnect from "../WalletConnect/WalletConnect";

// Dependnancies
import { NavLink, useNavigate  } from "react-router-dom";
import {useState} from "react";

// Assets
import logo from "../../assets/Logo/community.svg";

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
            Join the Raptors VIP List
          </NavLink>
        </div>
        <div className="header__link-container">
          <NavLink
            to="/buy-tickets"
            className="header__link"
            onClick={() => handleNavLinkClick("/buy-tickets")}
          >
            Purchase Tickets
          </NavLink>
        </div>
        <div className="header__link-container">
          <NavLink
            to="/tickets"
            className="header__link"
            onClick={() => handleNavLinkClick("/tickets")}
          >
            View Your Ticket
          </NavLink>
        </div>
        <div className="header__link-container">
          <NavLink
            to="/shopping"
            className="header__link"
            onClick={() => handleNavLinkClick("/shop")}
          >
            Merch Available Only for Ticket Owners
          </NavLink>
        </div>
        <div className="header__link-container">
        <WalletConnect />
        </div>
      </div>
    </header>
  );
}
