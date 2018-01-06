import * as actionTypes from '../constants/actionTypes'

export function setType(type) {
  return { type: actionTypes.TYPE_SET, payload: { type } };
}

export function generateScramble(type) {
  return { type: actionTypes.SCRAMBLE_GENERATED, payload: { type } };
}

export function setState(state) {
  return { type: actionTypes.STATE_SET, payload: { state } };
}

export function startHolding(holdingStartTime) {
  return { type: actionTypes.HOLDING_STARTED, payload: { holdingStartTime } };
}

export function stopHolding() {
  return { type: actionTypes.HOLDING_STOPPED };
}

export function startTimer(runningStartTime) {
  return { type: actionTypes.TIMER_STARTED, payload: { runningStartTime } };
}

export function stopTimer(runningStopTime) {
  return { type: actionTypes.TIMER_STOPPED, payload: { runningStopTime } };
}