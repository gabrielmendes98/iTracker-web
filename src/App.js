import React from 'react';

import graphQLFetch from './services/graphQLFetch';
import store from './store';
import Routes from './router';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import UserContext from './UserContext';

import './styles.css';

class App extends React.Component {
  static async fetchData(cookie) {
    const query = `query { user {
      signedIn givenName picture
    }}`;
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  constructor(props) {
    super(props);
    const user = store.userData ? store.userData.user : null;
    delete store.userData;
    this.state = { ready: false, user };
  }

  async componentDidMount() {
    this.setState({ ready: true });
    const { user } = this.state;
    if (user == null) {
      const data = await App.fetchData();
      this.setState({ user: data.user });
    }
  }

  onUserChange = (user) => {
    this.setState({ user });
  };

  render() {
    const { user } = this.state;
    if (user == null) return null;
    const { ready } = this.state;
    return (
      <div id="wrapper" style={{ visibility: ready ? 'visible' : 'hidden' }}>
        <NavBar user={user} onUserChange={this.onUserChange} />
        <div id="main">
          <UserContext.Provider value={user}>
            <Routes />
          </UserContext.Provider>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
