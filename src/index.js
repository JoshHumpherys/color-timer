import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import { createStore, compose } from 'redux'
import rootReducer from './reducers/rootReducer'

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
  localStorage.setItem('sessions', JSON.stringify(store.getState().timer.sessions));
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
