import React from 'react';
import Routes from './routes';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './styles.css';

const App = () => (
  <div>
    <div id="main-content">
      <NavBar />
      <Routes />
    </div>
    <Footer />
  </div>
);

export default App;
