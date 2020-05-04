import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from '../src/App';
import template from './template';

function render(req, res) {
  const element = (
    <StaticRouter location={req.url} context={{}}>
      <App />
    </StaticRouter>
  );
  const body = ReactDOMServer.renderToString(element);
  res.send(template(body));
}

export default render;
