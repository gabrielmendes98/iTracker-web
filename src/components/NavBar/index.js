import React, { Component } from 'react';
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
        <MoreVertIcon className="about-icon" />
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem to="/about" component={Link} onClick={handleClose}>
          About
        </MenuItem>
      </Menu>
    </div>
  );
};

class NavBar extends Component {
  componentDidMount() {
    const nav = document.getElementsByTagName('ul')[0];
    const search = document.querySelector('.search');
    const userControl = document.querySelector('.user-profile');
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelectorAll('ul li');

    window.addEventListener(
      'resize',
      () => {
        if (window.innerWidth > 1035) {
          nav.classList.remove('transition');
          search.classList.remove('transition');
          userControl.classList.remove('transition');
          nav.classList.remove('nav-active');
          search.classList.remove('nav-active');
          userControl.classList.remove('nav-active');
          burger.classList.remove('toggle');
          navLinks.forEach((link, index) => {
            link.style.animation = '';
          });
        }
      },
      false
    );
  }

  activeNav = () => {
    const nav = document.getElementsByTagName('ul')[0];
    const search = document.querySelector('.search');
    const userControl = document.querySelector('.user-profile');
    const navLinks = document.querySelectorAll('ul li');
    const burger = document.querySelector('.burger');

    nav.classList.add('transition');
    search.classList.add('transition');
    userControl.classList.add('transition');

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

  navHandling = () => {
    if (window.innerWidth <= 1035) this.activeNav();
  };

  render() {
    const { user, onUserChange } = this.props;
    return (
      <header>
        <nav>
          <div className="burger" onClick={this.activeNav}>
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
                <NavLink exact to="/" onClick={this.navHandling}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/issues" onClick={this.navHandling}>
                  Issue list
                </NavLink>
              </li>
              <li>
                <NavLink to="/report" onClick={this.navHandling}>
                  Report
                </NavLink>
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
  }
}

export default NavBar;
