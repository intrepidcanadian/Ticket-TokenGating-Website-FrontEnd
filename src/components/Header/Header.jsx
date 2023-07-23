import "./Header.scss";

// Dependnancies
import { NavLink } from "react-router-dom";

// Assets
import logo from "../../assets/Logo/Stacked_with_space_1.png";

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo-container">
        <NavLink
          to="/"
          activeClassName="header__link--active"
          className="no_underline"
        >
          <img className = "header__logo" src={logo} alt="Conflux Logo" />
        </NavLink>
      </div>
      <div className="header__links">
        <div className="header__link-container">
          <NavLink
            exact
            to="/intrepid-mint-page"
            activeClassName="header__link--active"
            className="header__link no_underline"
          >
            Build Your Community
          </NavLink>
        </div>
        <div className="header__link-container">
          <NavLink
            exact
            to="/shop"
            activeClassName="header__link--active"
            className="header__link no_underline"
          >
            Shop Products
          </NavLink>
        </div>
      </div>
    </header>
  );
}
