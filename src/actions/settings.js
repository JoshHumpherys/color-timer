import * as actionTypes from '../constants/actionTypes'

export function setInspectionTime(inspectionTime) {
  return { type: actionTypes.INSPECTION_TIME_SET, payload: { inspectionTime } };
}