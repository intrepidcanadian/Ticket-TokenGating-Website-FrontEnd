import "./Header.scss";
import WalletConnect from "../WalletConnect/WalletConnect";

// Dependnancies
import { NavLink } from "react-router-dom";

// Assets
import logo from "../../assets/Logo/community.svg";

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo-container">
        <NavLink
          to="/"
          className="no_underline"
        >
          <img className = "header__logo" src={logo} alt="Conflux Logo" />
        </NavLink>
      </div>
      <div className="header__links">
      <div className="header__link-container">
          <NavLink
            to="/"
            className="header__link"
          >
            Home
          </NavLink>
        </div>
        <div className="header__link-container">
          <NavLink
            to="/mint"
            className="header__link"
          >
            Build Your Community
          </NavLink>
        </div>
        <div className="header__link-container">
          <NavLink
            to="/shop"
            className="header__link"
          >
            Shop Products
          </NavLink>
        </div>
        <div className="header__link-container">
        <WalletConnect />
        </div>
      </div>
    </header>
  );
}
