import React from 'react';
import ReactDOMServer from 'react-dom/server';

import About from '../src/components/About';
import template from './template';

function render(req, res) {
  const body = ReactDOMServer.renderToString(<About />);
  res.send(template(body));
}

export default render;
