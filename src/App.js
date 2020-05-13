import React from 'react';
import Routes from './router';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import UserContext from './UserContext';
import './styles.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ready: false, user: { signedIn: false, givenName: '', picture: '' } };
  }

  async componentDidMount() {
    this.setState({ ready: true });
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoint}/user`, {
      method: 'POST',
      credentials: 'include',
    });
    const body = await response.text();
    const result = JSON.parse(body);
    const { signedIn, givenName, picture } = result;
    this.setState({ user: { signedIn, givenName, picture }, ready: true });
  }

  onUserChange = (user) => {
    this.setState({ user });
  };

  render() {
    const { user } = this.state;
    return (
      <div style={{ visibility: this.state.ready ? 'visible' : 'hidden' }}>
        <div id="main">
          <NavBar user={user} onUserChange={this.onUserChange} />
          <div id="page-content">
            <UserContext.Provider value={user}>
              <Routes />
            </UserContext.Provider>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
