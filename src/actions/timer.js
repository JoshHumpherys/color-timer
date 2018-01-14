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

export function startInspection(inspectionStartTime) {
  return { type: actionTypes.INSPECTION_STARTED, payload: { inspectionStartTime } };
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

export function setSpacebarIsDown(spacebarIsDown) {
  return { type: actionTypes.SPACEBAR_IS_DOWN_SET, payload: { spacebarIsDown } };
}

export function createSession(name) {
  return { type: actionTypes.SESSION_CREATED, payload: { name } };
}

export function switchSession(index) {
  return { type: actionTypes.SESSION_SWITCHED, payload: { index } };
}