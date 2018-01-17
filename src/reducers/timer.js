import * as actionTypes from '../constants/actionTypes'
import * as stateTypes from '../constants/stateTypes'
import  Scrambo from 'scrambo'
import Session from '../classes/Session'
import Solve from '../classes/Solve'
import Time from '../classes/Time'
import * as penaltyTypes from '../constants/penaltyTypes'

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
    scramble: new Scrambo().get(), // TODO don't make another Scrambo object
    state: stateTypes.IDLE,
    inspectionStartTime: null,
    holdingStartTime: null,
    runningStartTime: null,
    spacebarIsDown: false,
    timerJustStopped: false,
    timeObj: new Time(0),
    penaltyType: penaltyTypes.NONE,
    sessions: [
      new Session('Anonymous Session 1')
    ],
    currentSessionIndex: 0
  },
  action) {
  switch (action.type) {
    case actionTypes.TYPE_SET: {
      return { ...state, type: action.payload.type };
    }
    case actionTypes.SCRAMBLE_GENERATED: {
      return { ...state, scramble: state.scrambos[action.payload.type].get() };
    }
    case actionTypes.INSPECTION_STARTED: {
      let { timeObj, penaltyType } = state;
      if(state.state === stateTypes.IDLE) {
        timeObj = new Time(0);
        penaltyType = penaltyTypes.NONE;
      }
      return {
        ...state,
        state: stateTypes.INSPECTION,
        inspectionStartTime: action.payload.inspectionStartTime,
        timeObj,
        penaltyType
      };
    }
    case actionTypes.CURRENT_PENALTY_SET: {
      return { ...state, penaltyType: action.payload.penaltyType };
    }
    case actionTypes.HOLDING_STARTED: {
      let { timeObj, penaltyType } = state;
      if(state.state === stateTypes.IDLE) {
        timeObj = new Time(0);
        penaltyType = penaltyTypes.NONE;
      }
      return { ...state, holdingStartTime: action.payload.holdingStartTime, timeObj, penaltyType };
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
      const sessions = [...state.sessions];
      const currentSession = sessions[state.currentSessionIndex];
      const timeObj = new Time(
        action.payload.runningStopTime - state.runningStartTime +
          (state.penaltyType === penaltyTypes.PLUS_TWO ? 2000 : 0),
        state.penaltyType
      );
      const solve = new Solve(state.scramble, timeObj, state.penaltyType);
      sessions[state.currentSessionIndex] = currentSession.addSolve(solve);
      return {
        ...state,
        state: stateTypes.IDLE,
        runningStartTime: null,
        timeObj,
        scramble: state.scrambos[state.type].get(),
        timerJustStopped: true,
        sessions
      };
    }
    case actionTypes.SPACEBAR_IS_DOWN_SET: {
      const { spacebarIsDown } = action.payload;
      return { ...state, spacebarIsDown, timerJustStopped: state.timerJustStopped && !spacebarIsDown };
    }
    case actionTypes.SESSION_CREATED: {
      const { name } = action.payload;
      const newName = name || 'Anonymous Session ' + state.sessions.length + 1;
      return {
        ...state,
        sessions: [...state.sessions, new Session(newName)],
        currentSessionIndex: state.sessions.length
      };
    }
    case actionTypes.SESSION_SWITCHED: {
      return { ...state, currentSessionIndex: action.payload.index };
    }
    default: {
      return state;
    }
    case actionTypes.PENALTY_SET: {
      const { penaltyType, solveIndex } = action.payload;
      const sessions = [...state.sessions];
      const currentSession = sessions[state.currentSessionIndex];
      sessions[state.currentSessionIndex] = currentSession.setPenaltyType(penaltyType, solveIndex);
      return {
        ...state,
        sessions
      };
    }
  }
}