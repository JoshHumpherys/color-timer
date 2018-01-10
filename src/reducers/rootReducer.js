import { combineReducers } from 'redux'
import timer from './timer'
import settings from './settings'
import modal from './modal'

const rootReducer = combineReducers({
  timer,
  settings,
  modal
});

export default rootReducer;