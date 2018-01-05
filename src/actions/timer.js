import * as actionTypes from '../constants/actionTypes'

export function setType(type) {
  return { type: actionTypes.TYPE_SET, payload: { type } };
}

export function generateScramble(type) {
  return { type: actionTypes.SCRAMBLE_GENERATED, payload: { type } };
}