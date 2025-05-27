import React, { useState, useEffect, useRef } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./NavBar.css";
import logo_icon from "../Assets/logo.png";
import { Nav, NavDropdown } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { LogOut, Heart, User } from "lucide-react";

export const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const isLoggedIn = !!localStorage.getItem("user"); // or context, cookie, etc.

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Nav className="nav">
      <img src={logo_icon} alt="logo_icon" />
      <ul>
        <CustomLink to="/">Main Page</CustomLink>
        <CustomLink to="/Schedule">Schedule</CustomLink>
        <CustomLink to="/Ratings">Ratings</CustomLink>
        <CustomLink to="/AllTeams">All Teams</CustomLink>
      </ul>
      <ul ref={dropdownRef}>
        <div className="navicons">
          {isLoggedIn ? (
            <>
              <NavDropdown
                title={<Heart className="navicon" />}
                id="nav-dropdown"
                show={showDropdown}
                onToggle={(isOpen) => setShowDropdown(isOpen)}
                className="custom-nav-dropdown"
              >
                <NavDropdown.Item as="div">
                  <CustomLink to="/Schedule">
                    Check out latest games result overview
                  </CustomLink>
                </NavDropdown.Item>
                <NavDropdown.Item as="div">
                  <CustomLink to="/TeamPlayers/25">
                    Following player: Walter Tavales data changed
                  </CustomLink>
                </NavDropdown.Item>
                <NavDropdown.Item as="div">
                  <CustomLink to="/TeamStats/Real%20Madrid">
                    Following Teams: Real Madrid data changed
                  </CustomLink>
                </NavDropdown.Item>
              </NavDropdown>

              <CustomLink to="/Settings">
                <User className="navicon" />
              </CustomLink>

              <CustomLink to="/Login">
                <LogOut className="navicon" />
              </CustomLink>
            </>
          ) : (
            <CustomLink to="/Login">
              <User className="navicon" />
            </CustomLink>
          )}
        </div>
      </ul>
    </Nav>
  );
};

export default NavBar;

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
