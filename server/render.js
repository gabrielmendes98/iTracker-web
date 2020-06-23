import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';

import App from '../src/App';
import template from './template';
import routes from '../src/router/routes';
import store from '../src/store';

async function render(req, res) {
  const activeRoute = routes.find((route) => matchPath(req.path, route));

  let initialData;
  if (activeRoute && activeRoute.component.fetchData) {
    const match = matchPath(req.path, activeRoute);
    const index = req.url.indexOf('?');
    const search = index !== -1 ? req.url.substr(index) : null;
    initialData = await activeRoute.component.fetchData(match, search, req.headers.cookie);
  }

  const userData = await App.fetchData(req.headers.cookie);

  store.initialData = initialData;
  store.userData = userData;

  const context = {};
  const element = (
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  const body = ReactDOMServer.renderToString(element);

  if (context.url) {
    res.redirect(301, context.url);
  } else {
    res.send(template(body, initialData, userData));
  }
}

export default render;
