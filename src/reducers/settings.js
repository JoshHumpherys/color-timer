import * as actionTypes from '../constants/actionTypes'

export default function settings(
  state = {
    inspectionTime: 15
  },
  action) {
  switch (action.type) {
    case actionTypes.INSPECTION_TIME_SET: {
      return { ...state, inspectionTime: action.payload.inspectionTime };
    }
    default: {
      return state;
    }
  }
}