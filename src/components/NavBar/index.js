import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './styles.css';
import Search from '../Search';
import IssueAddNavItem from '../IssueAddNavItem';
import SignInNavItem from '../SignInNavItem';
import Button from '@material-ui/core/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const MenuGrow = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button color="inherit" onClick={handleClick}>
        <MoreVertIcon />
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem to="/about" component={Link} onClick={handleClose}>
          About
        </MenuItem>
      </Menu>
    </div>
  );
};

const NavBar = ({ user, onUserChange }) => {
  const activeNav = () => {
    const nav = document.getElementsByTagName('ul')[0];
    const search = document.querySelector('.search');
    const navLinks = document.querySelectorAll('ul li');
    const userControl = document.querySelector('.user-profile');
    const burger = document.querySelector('.burger');
    nav.classList.toggle('nav-active');
    search.classList.toggle('nav-active');
    userControl.classList.toggle('nav-active');

    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      }
    });

    burger.classList.toggle('toggle');
  };

  return (
    <header>
      <nav>
        <div className="burger" onClick={activeNav}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <div id="left">
          <div className="logo">Issue Tracker</div>
          <div className="search">
            <Search />
          </div>
          <ul>
            <li>
              <NavLink exact to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/issues">Issue list</NavLink>
            </li>
            <li>
              <NavLink to="/report">Report</NavLink>
            </li>
          </ul>
        </div>
        <div id="right">
          <IssueAddNavItem user={user} />
          <MenuGrow />
          <div className="user-profile">
            <SignInNavItem className="user-profile" user={user} onUserChange={onUserChange} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
