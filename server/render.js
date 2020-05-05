import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from '../src/App';
import template from './template';

import { StaticRouter, matchPath } from 'react-router-dom';

import routes from '../src/routes.js';
import store from '../src/store.js';

async function render(req, res) {
  const activeRoute = routes.find((route) => matchPath(req.path, route));

  let initialData;
  if (activeRoute && activeRoute.component.fetchData) {
    const match = matchPath(req.path, activeRoute);
    const index = req.url.indexOf('?');
    const search = index !== -1 ? req.url.substr(index) : null;
    initialData = await activeRoute.component.fetchData(match, search);
  }
  store.initialData = initialData;
  const element = (
    <StaticRouter location={req.url} context={{}}>
      <App />
    </StaticRouter>
  );
  const body = ReactDOMServer.renderToString(element);
  res.send(template(body, initialData));
}

export default render;
