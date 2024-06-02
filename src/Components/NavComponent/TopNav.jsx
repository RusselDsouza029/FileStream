import React, { useEffect, useRef, useState } from "react";
import "../../styles/Nav.scss";
import SideMenu from "./SideNav";
import { AnimatePresence, motion } from "framer-motion";
import {
  CiUser,
  CiImageOn,
  CiMusicNote1,
  CiDark,
  CiLight,
  CiHome,
} from "react-icons/ci";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { AppUseContext } from "../../context/AppContext";
import Tooltip from "../Tooltip";
import { MdLabelOutline } from "react-icons/md";
import Logo from "../../assets/images/logo.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaInfo } from "react-icons/fa6";
import { GoInfo } from "react-icons/go";

const TopNav = () => {
  const {
    signout,
    userStatus,
    setCheckSideMenu,
    setIsToggleOn,
    isToggleOn,
  } = AppUseContext();

  const [isMenuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
    setCheckSideMenu(!isMenuOpen);
  };

  const sideVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const menuToogleVariant = {
    open: { left: 0, opacity: 1 },
    close: { left: "-10px", opacity: 0 },
  };

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const dropdownVariants = {
    open: { y: 10, opacity: 1 },
    close: { y: -5, opacity: 0 },
  };

  const handleTheme = (val) => {
    setIsToggleOn(val);
    handleDropdown();
    localStorage.setItem("themeVal", val ? "light" : "dark");
  };
  return (
    <nav className={isToggleOn ? "light-nav" : null}>
      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu}>
        <motion.ul variants={sideVariants}>
          <NavLink
            end
            to="/user-account"
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            <Tooltip text="Account" position="right">
              <li>
                <CiUser />
              </li>
            </Tooltip>
          </NavLink>
          <hr />
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            <Tooltip text="Home" position="right">
              <li>
                <CiHome />
              </li>
            </Tooltip>
          </NavLink>
          <NavLink
            to="/image"
            end
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            <Tooltip text="Image" position="right">
              <li>
                <CiImageOn />
              </li>
            </Tooltip>
          </NavLink>
          <NavLink
            to="/video"
            end
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            <Tooltip text="Videos" position="right">
              <li>
                <MdOutlineVideoLibrary />
              </li>
            </Tooltip>
          </NavLink>
          <NavLink
            to="/audio"
            end
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            <Tooltip text="audio" position="right">
              <li>
                <CiMusicNote1 />
              </li>
            </Tooltip>
          </NavLink>
          <NavLink
            to="/docs"
            end
            className={({ isActive }) => (isActive ? "active-link" : null)}
          >
            <Tooltip text="Documents" position="right">
              <li>
                <IoDocumentTextOutline />
              </li>
            </Tooltip>
          </NavLink>
          {userStatus && (
            <NavLink
              to="/label"
              end
              className={({ isActive }) => (isActive ? "active-link" : null)}
            >
              <Tooltip text="Label" position="right">
                <li>
                  <MdLabelOutline />
                </li>
              </Tooltip>
            </NavLink>
          )}
          <NavLink
            to="/about"
            end
            className={({ isActive }) =>
              isActive
                ? "active-link side-nav-about-link"
                : "side-nav-about-link"
            }
          >
            <Tooltip text="About" position="right">
              <li>
                <GoInfo />
              </li>
            </Tooltip>
          </NavLink>
          {userStatus && (
            <Tooltip text="Signout" position="right">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  signout();
                }}
              >
                <li>
                  <IoLogOutOutline />
                </li>
              </a>
            </Tooltip>
          )}
        </motion.ul>
      </SideMenu>
      <header>
        <div className="logo-container">
          <div className="hamburger-menu-content" onClick={toggleMenu}>
            <RxHamburgerMenu />
            <AnimatePresence>
              {isMenuOpen && (
                <motion.span
                  variants={menuToogleVariant}
                  animate="open"
                  exit="close"
                  initial="close"
                  transition={{
                    duration: 0.5,
                  }}
                >
                  Menu
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="logo-box">
            <img src={Logo} alt="logo" width="35" />
            <span className="logo-text">FileStream</span>
          </span>
        </div>
        <div className="nav-right-content">
          <div className="dropdown-container" ref={dropdownRef}>
            <button onClick={handleDropdown}>
              {isToggleOn ? (
                <>
                  <CiLight />
                  Light Mode
                </>
              ) : (
                <>
                  <CiDark />
                  Dark Mode
                </>
              )}
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={dropdownVariants}
                  animate="open"
                  initial="close"
                  exit="close"
                  className="dropdown"
                >
                  <button
                    onClick={() => {
                      handleTheme(false);
                    }}
                  >
                    <CiDark />
                    Dark Mode
                  </button>
                  <button
                    onClick={() => {
                      handleTheme(true);
                    }}
                  >
                    <CiLight />
                    Light Mode
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/about" className="nav-about-icon">
            <button style={{ height: "100%" }}>
              <FaInfo />
            </button>
          </Link>
        </div>
      </header>
    </nav>
  );
};

export default TopNav;
