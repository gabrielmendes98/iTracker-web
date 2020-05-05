import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from '../src/App';
import template from './template';

import { StaticRouter } from 'react-router-dom';

import graphQLFetch from '../src/graphQLFetch.js';
import store from '../src/store.js';

async function render(req, res) {
  const initialData = await graphQLFetch('query{about}');
  console.log(initialData);
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
