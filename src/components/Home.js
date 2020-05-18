import React, { Component } from 'react';

export default class Home extends Component {
  render() {
    return (
      <div style={{ width: '50%', margin: 'auto', backgroundImage: '../../assets/mern-stack.png' }}>
        <h1 style={{ textAlign: 'center' }}>Issue Tracker</h1>
        <h4>
          Issue Management is the process of identifying, reporting and resolving all such issues and bugs that may
          otherwise impair the progress of a project.
        </h4>
        <h4>
          The process of managing issues, however, is not always a smooth ride. You have to ensure each issue is
          adequately reported on time, prioritized, logged into the database and appointed to a suitable person who has
          the optimum set of skills to fix it. Which is why Project Managers employ the help of an issue management
          software, and this issue tracker app is here to do this job for free.
        </h4>
        <p>
          You can see the issues and details by clicking on them, but to perform actions in the application you need to
          log in with Google account. To add an issue, just click the "+" button on the navigation bar.
        </p>
        <p>
          This is a fullstack app, using the MERN stack and Material UI. The backend uses GraphQL. Full source code
          available at{' '}
          <a
            style={{ textDecoration: 'none', color: 'blue' }}
            href="https://github.com/gabrielmendes98/issue-tracker"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    );
  }
}
