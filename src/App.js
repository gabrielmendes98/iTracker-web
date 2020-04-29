import React from 'react';
import Routes from './routes';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './styles.css';

const App = () => (
  <div>
    <div id="main">
      <NavBar />
      <div id="page-content">
        <Routes />
      </div>
    </div>
    <Footer />
  </div>
);

export default App;
