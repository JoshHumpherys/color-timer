import * as actionTypes from '../constants/actionTypes'

export function setInspection(inspection) {
  return { type: actionTypes.INSPECTION_SET, payload: { inspection } };
}

export function setHoldTime(holdTime) {
  return { type: actionTypes.HOLD_TIME_SET, payload: { holdTime } };
}

export function setDisplayMillis(displayMillis) {
  return { type: actionTypes.DISPLAY_MILLIS_SET, payload: { displayMillis } };
}

export function setHideSolveTime(hideSolveTime) {
  return { type: actionTypes.HIDE_SOLVE_TIME_SET, payload: { hideSolveTime } };
}

export function setShowTimes(showTimes) {
  return { type: actionTypes.SHOW_TIMES_SET, payload: { showTimes } };
}