import * as actionTypes from '../constants/actionTypes'
import * as holdTimeTypes from '../constants/holdTimeTypes'

export default function settings(
  state = {
    inspection: true,
    holdTime: holdTimeTypes.STACK_MAT,
    displayMillis: false
  },
  action) {
  switch (action.type) {
    case actionTypes.INSPECTION_SET: {
      return { ...state, inspection: action.payload.inspection };
    }
    case actionTypes.HOLD_TIME_SET: {
      return { ...state, holdTime: action.payload.holdTime };
    }
    case actionTypes.DISPLAY_MILLIS_SET: {
      return { ...state, displayMillis: action.payload.displayMillis };
    }
    default: {
      return state;
    }
  }
}