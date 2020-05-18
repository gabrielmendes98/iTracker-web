import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './routes.js';

const Routes = () => (
  <Switch>
    {routes.map((attrs) => (
      <Route {...attrs} key={attrs.path} />
    ))}
  </Switch>
);

export default Routes;
