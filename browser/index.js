import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.hydrate(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('contents')
);

if (module.hot) {
  module.hot.accept();
}
