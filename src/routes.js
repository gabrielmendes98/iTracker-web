import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import IssueList from './components/IssueList';
import IssueReport from './components/IssueReport';
import IssueEdit from './components/IssueEdit';
import About from './components/About';

const NotFound = () => <h1>Page Not Found</h1>;

const Routes = () => (
  <Switch>
    <Redirect exact from="/" to="/issues" />
    <Route path="/issues" component={IssueList} />
    <Route path="/report" component={IssueReport} />
    <Route path="/edit/:id" component={IssueEdit} />
    <Route path="/about" component={About} />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
