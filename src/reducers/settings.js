import * as actionTypes from '../constants/actionTypes'
import * as holdTimeTypes from '../constants/holdTimeTypes'

export default function settings(
  state = {
    inspection: false,
    holdTime: holdTimeTypes.THREE_TENTHS_SECOND,
    displayMillis: false,
    hideSolveTime: false
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
    case actionTypes.HIDE_SOLVE_TIME_SET: {
      return { ...state, hideSolveTime: action.payload.hideSolveTime };
    }
    default: {
      return state;
    }
  }
}