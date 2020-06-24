import React from 'react';
import './styles.css';

export default function Home() {
  return (
    <>
      <div className="bg">
        <h1>iTracker</h1>
      </div>
      <div className="explanation">
        <p style={{ margin: '20px 0' }}>
          Issue Management is the process of identifying, reporting and resolving all such issues and bugs that may
          otherwise impair the progress of a project.
        </p>
        <p style={{ margin: '20px 0' }}>
          The process of managing issues, however, is not always a smooth ride. You have to ensure each issue is
          adequately reported on time, prioritized, logged into the database and appointed to a suitable person who has
          the optimum set of skills to fix it. Which is why Project Managers employ the help of an issue management
          software, and this issue tracker app is here to do this job for free.
        </p>
        <p style={{ margin: '20px 0' }}>
          You can see the issues and details by clicking on them, but to perform actions in the application you need to
          log in with Google account. To add an issue, just click the &quot;+&quot; button on the navigation bar.
        </p>
      </div>
    </>
  );
}
