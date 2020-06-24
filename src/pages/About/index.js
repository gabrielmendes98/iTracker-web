import React from 'react';

import store from '../../store';
import graphQLFetch from '../../services/graphQLFetch';

class About extends React.Component {
  static async fetchData() {
    const data = await graphQLFetch('query {about}');
    return data;
  }

  constructor(props) {
    super(props);
    const apiAbout = store.initialData ? store.initialData.about : null;
    delete store.initialData;
    this.state = { apiAbout };
  }

  async componentDidMount() {
    const { apiAbout } = this.state;
    if (apiAbout == null) {
      const data = await About.fetchData();
      this.setState({ apiAbout: data.about });
    }
  }

  render() {
    const { apiAbout } = this.state;
    return (
      <div className="text-center">
        <h4>iTracker UI v1.0</h4>
        <h4>{apiAbout}</h4>
        <br />
        <h4>Author: Gabriel Santiago</h4>
        <p>
          Full source code available at&nbsp;
          <a
            style={{ textDecoration: 'none', color: 'blue' }}
            href="https://github.com/gabrielmendes98/issue-tracker"
            rel="noreferrer noopener"
            target="_blank"
          >
            GitHub
          </a>
        </p>
      </div>
    );
  }
}

export default About;
