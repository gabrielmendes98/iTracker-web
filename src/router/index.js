import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from './routes';

const Routes = () => (
  <Switch>
    {routes.map((attrs) => (
      <Route {...attrs} key={attrs.path} />
    ))}
  </Switch>
);

export default Routes;
