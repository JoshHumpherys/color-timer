import * as actionTypes from '../constants/actionTypes'
import * as stateTypes from '../constants/stateTypes'
import  Scrambo from 'scrambo'

export default function timer(
  state = {
    type: '333',
    scrambos: {
      222: new Scrambo().type('222'),
      333: new Scrambo().type('333'),
      444: new Scrambo().type('444'),
      555: new Scrambo().type('555'),
      666: new Scrambo().type('666'),
      777: new Scrambo().type('777'),
      clock: new Scrambo().type('clock'),
      minx: new Scrambo().type('minx'),
      pyram: new Scrambo().type('pyram'),
      sq1: new Scrambo().type('sq1'),
      skewb: new Scrambo().type('skewb')
    },
    scramble: new Scrambo().get(), // TODO don't make another Scrambo objects
    state: stateTypes.IDLE,
    inspectionStartTime: null,
    holdingStartTime: null,
    runningStartTime: null,
    spacebarIsDown: false,
    timerJustStopped: false,
    time: 0
  },
  action) {
  switch (action.type) {
    case actionTypes.TYPE_SET: {
      return { ...state, type: action.payload.type };
    }
    case actionTypes.SCRAMBLE_GENERATED: {
      return { ...state, scramble: state.scrambos[action.payload.type].get() };
    }
    case actionTypes.STATE_SET: {
      return { ...state, state: action.payload.state };
    }
    case actionTypes.INSPECTION_STARTED: {
      return { ...state, state: stateTypes.INSPECTION, inspectionStartTime: action.payload.inspectionStartTime };
    }
    case actionTypes.HOLDING_STARTED: {
      return { ...state, holdingStartTime: action.payload.holdingStartTime };
    }
    case actionTypes.HOLDING_STOPPED: {
      return { ...state, holdingStartTime: null };
    }
    case actionTypes.TIMER_STARTED: {
      return {
        ...state,
        state: stateTypes.RUNNING,
        runningStartTime: action.payload.runningStartTime,
        holdingStartTime: null,
        inspectionStartTime: null
      };
    }
    case actionTypes.TIMER_STOPPED: {
      return {
        ...state,
        state: stateTypes.IDLE,
        runningStartTime: null,
        time: action.payload.runningStopTime - state.runningStartTime,
        scramble: state.scrambos[state.type].get(),
        timerJustStopped: true
      };
    }
    case actionTypes.SPACEBAR_IS_DOWN_SET: {
      const { spacebarIsDown } = action.payload;
      return { ...state, spacebarIsDown, timerJustStopped: state.timerJustStopped && !spacebarIsDown };
    }
    default: {
      return state;
    }
  }
}