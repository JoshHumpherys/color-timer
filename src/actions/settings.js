import * as actionTypes from '../constants/actionTypes'

export function setInspection(inspection) {
  return { type: actionTypes.INSPECTION_SET, payload: { inspection } };
}

export function setHoldTime(holdTime) {
  return { type: actionTypes.HOLD_TIME_SET, payload: { holdTime } };
}