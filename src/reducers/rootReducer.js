import { combineReducers } from 'redux'
import timer from './timer'
import settings from './settings'

const rootReducer = combineReducers({
  timer,
  settings
});

export default rootReducer;