import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { configureStore } from 'app/store';
import { Router } from 'react-router-dom';
import { App } from './app';

import './assets/css/bootstrap.min.css';
import './assets/css/daterangepicker.css';
import './assets/css/line-icons.css';
import './assets/css/chosen.css';
import './assets/css/style.css';
import './assets/css/responsive.css';

// prepare store
const history = createBrowserHistory();
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
