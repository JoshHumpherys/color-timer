import * as actionTypes from '../constants/actionTypes'
import * as stateTypes from '../constants/stateTypes'
import Session from '../classes/Session'
import Solve from '../classes/Solve'
import Time from '../classes/Time'
import * as penaltyTypes from '../constants/penaltyTypes'

import scrambler222 from '../lib/scramble_222'
import scrambler333 from '../lib/scramble_333'
import { scrambler444 } from '../lib/scramble_NNN'
import { scrambler555 } from '../lib/scramble_NNN'
import { scrambler666 } from '../lib/scramble_NNN'
import { scrambler777 } from '../lib/scramble_NNN'
import scramblerClock from '../lib/scramble_clock'
import scramblerMinx from '../lib/scramble_minx'
import scramblerPyram from '../lib/scramble_pyram'
import scramblerSq1 from '../lib/scramble_sq1'

export default function timer(
  state = {
    type: '333',
    scramblers: {
      222: scrambler222,
      333: scrambler333,
      444: scrambler444,
      555: scrambler555,
      666: scrambler666,
      777: scrambler777,
      clock: scramblerClock,
      minx: scramblerMinx,
      pyram: scramblerPyram,
      sq1: scramblerSq1
    },
    scramble: scrambler333.getRandomScramble().scramble_string,
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
      return { ...state, scramble: state.scramblers[action.payload.type].getRandomScramble().scramble_string };
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
        scramble: state.scramblers[state.type].getRandomScramble().scramble_string,
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
    case actionTypes.SESSIONS_SET: {
      const sessions = [...action.payload.sessions].map(session =>
        new Session(session.name, session.solves.map(solve =>
          new Solve(solve.scramble, new Time(solve.timeObj.timeMillis, solve.timeObj.penaltyType), solve.comment)
        ))
      );

      return { ...state, sessions };
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
    default: {
      return state;
    }
  }
}