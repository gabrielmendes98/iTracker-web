import React from 'react';
import Routes from './routes';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './styles.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ready: false }; // This one.
  }

  componentDidMount() {
    this.setState({ ready: true }); // This one.
  }

  render() {
    return (
      <div style={{ visibility: this.state.ready ? 'visible' : 'hidden' }}>
        <div id="main">
          <NavBar />
          <div id="page-content">
            <Routes />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
