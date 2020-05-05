import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/App';
import { BrowserRouter } from 'react-router-dom';
import store from '../src/store';

// eslint-disable-next-line no-underscore-dangle
store.initialData = window.__INITIAL_DATA__;

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
