import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { createStore, compose } from 'redux'
import rootReducer from './reducers/rootReducer'
import * as firebase from 'firebase'
import registerServiceWorker from './registerServiceWorker'

const middleware = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

// TODO use persisted state with createStore
// const sessions = localStorage.getItem('sessions');
// const persistedState = sessions ? JSON.parse(sessions) : {};

const store = createStore(
  rootReducer,
  // persistedState,
  middleware
);

store.subscribe(() =>  {
  // localStorage.setItem('sessions', JSON.stringify({ timer: { sessions: store.getState().timer.sessions } }));
  const state = store.getState();
  localStorage.setItem('sessions', JSON.stringify(state.timer.sessions));
  localStorage.setItem('type', JSON.stringify(state.timer.type));
  localStorage.setItem('currentSessionIndex', JSON.stringify(state.timer.currentSessionIndex));
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

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
