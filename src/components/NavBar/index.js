import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './styles.css';

export default class NavBar extends Component {
  activeNav = () => {
    const nav = document.getElementsByTagName('ul')[0];
    const navLinks = document.querySelectorAll('ul li');
    const burger = document.querySelector('.burger');
    nav.classList.toggle('nav-active');
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      }
    });
    burger.classList.toggle('toggle');
  };

  render() {
    return (
      <header>
        <nav>
          <div class="logo">Issue Tracker</div>
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
          <div class="burger" onClick={this.activeNav}>
            <div class="line1"></div>
            <div class="line2"></div>
            <div class="line3"></div>
          </div>
        </nav>
      </header>
    );
  }
}
