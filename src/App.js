import React from 'react';
import graphQLFetch from './graphQLFetch';
import store from './store';
import Routes from './router';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import UserContext from './UserContext';
import './styles.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    const user = store.userData ? store.userData.user : null;
    delete store.userData;
    this.state = { ready: false, user };
  }

  async componentDidMount() {
    this.setState({ ready: true });
    const { user } = this.state;
    if (user === null) {
      const data = await App.fetchData();
      this.setState({ user: data.user });
    }
  }

  static async fetchData(cookie) {
    const query = `query { user {
      signedIn givenName picture
    }}`;
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  onUserChange = (user) => {
    this.setState({ user });
  };

  render() {
    const { user } = this.state;
    if (user === null) return null;
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
