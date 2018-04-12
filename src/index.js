import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { createStore, compose } from 'redux'
import { Router, Route, browserHistory } from 'react-router'
import rootReducer from './reducers/rootReducer'
import * as firebase from 'firebase'
import registerServiceWorker from './registerServiceWorker'

import SettingsPage from './SettingsPage'
import {initFromLocalStorage} from "./actions/timer";

const middleware = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
  rootReducer,
  middleware
);

store.subscribe(() =>  {
  const state = store.getState();
  localStorage.setItem('sessions', JSON.stringify(state.timer.sessions));
  localStorage.setItem('type', JSON.stringify(state.timer.type));
  localStorage.setItem('currentSessionIndex', JSON.stringify(state.timer.currentSessionIndex));
  localStorage.setItem('settings', JSON.stringify(state.settings));
  localStorage.setItem('colors', JSON.stringify(state.timer.colors));
});

const config = {
  apiKey: "AIzaSyAT93O_eIpSkjr0aTQbP3Y7CdW8IXxE14s",
  authDomain: "color-timer.firebaseapp.com",
  databaseURL: "https://color-timer.firebaseio.com",
  projectId: "color-timer",
  storageBucket: "",
  messagingSenderId: "1018938074440"
};
firebase.initializeApp(config);

const sessions = JSON.parse(localStorage.getItem('sessions'));
const type = JSON.parse(localStorage.getItem('type'));
const currentSessionIndex = JSON.parse(localStorage.getItem('currentSessionIndex'));
const settings = JSON.parse(localStorage.getItem('settings'));
const colors = JSON.parse(localStorage.getItem('colors'));
if(sessions !== null && type !== null && currentSessionIndex !== null && settings !== null && colors !== null) {
  store.dispatch(initFromLocalStorage(sessions, type, currentSessionIndex, settings, colors));
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <span>
        <Route exact path="/" component={App} />
        <Route path="/settings" component={SettingsPage} />
      </span>
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
