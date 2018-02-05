import Time from '../classes/Time'
import * as penaltyTypes from '../constants/penaltyTypes'

export const getType = state => state.timer.type;
export const getScrambo = state => state.timer.scramblers[state.timer.type];
export const getScramble = state => state.timer.scramble;
export const getState = state => state.timer.state;
export const getInspectionStartTime = state => state.timer.inspectionStartTime;
export const getHoldingStartTime = state => state.timer.holdingStartTime;
export const getRunningStartTime = state => state.timer.runningStartTime;
export const getSpacebarDown = state => state.timer.spacebarDown;
export const getTouchDown = state => state.timer.touchDown;
export const getTimerJustStopped = state => state.timer.timerJustStopped;
export const getTimeObj = state => state.timer.timeObj;
export const getPenaltyType = state => state.timer.penaltyType;
export const getColors = state => state.timer.colors;
export const getCurrentSessions = state =>
  state.timer.sessions.filter(session => session.type === state.timer.type);
export const getCurrentSessionIndex = state =>
  getCurrentSessions(state).indexOf(state.timer.sessions[state.timer.currentSessionIndex]);

export const getSolveStats = state => {
  const solves = [...state.timer.sessions[state.timer.currentSessionIndex].solves];
  const timeObjs = solves.map((solve, i) => ({ ...solve.timeObj, solveNumber: i }));

  const bests = {
    single: undefined,
    mo3: undefined,
    ao5: undefined,
    ao12: undefined,
    ao50: undefined,
    ao100: undefined
  };

  const compareSolves = (a, b) => {
    if(a.penaltyType === penaltyTypes.DNF && b.penaltyType === penaltyTypes.DNF) {
      return a.timeMillis - b.timeMillis;
    } else if(a.penaltyType === penaltyTypes.DNF) {
      return 1;
    } else if(b.penaltyType === penaltyTypes.DNF) {
      return -1;
    } else {
      return a.timeMillis - b.timeMillis;
    }
  };

  const sortedTimeObjs = [...timeObjs].sort(compareSolves);

  const timesWithoutDnfs = timeObjs
    .filter(timeObj => timeObj.penaltyType !== penaltyTypes.DNF)
    .map(timeObj => timeObj.timeMillis);

  const getLastNTimeObjs = (i, n) => i - (n - 1) >= 0 ? [...timeObjs].slice(i - (n - 1), i + 1) : [];

  const getMeanOfN = times => times.reduce((sum, time) => sum + time, 0) / times.length;

  const calculateMoN = n => {
    let best = undefined;
    for(let i = n - 1; i < timeObjs.length; i++) {
      const lastNTimeObjs = getLastNTimeObjs(i, n);
      if(lastNTimeObjs.some(timeObj => timeObj.penaltyType === penaltyTypes.DNF)) {
        timeObjs[i]['mo' + n] = new Time(0, penaltyTypes.DNF);
        if(best === undefined) {
          bests['mo' + n] = best = timeObjs[i]['mo' + n];
        }
      } else {
        const lastNTimes = lastNTimeObjs.map(timeObj => timeObj.timeMillis);
        const mean = getMeanOfN(lastNTimes);
        timeObjs[i]['mo' + n] = new Time(mean, penaltyTypes.NONE);
        if(best === undefined || best.penaltyType === penaltyTypes.DNF || mean < best.timeMillis) {
          bests['mo' + n] = best = timeObjs[i]['mo' + n];
        }
      }
    }
  };

  const getAverageOfNFromSortedTimes = sortedTimes => {
    const numToThrowOut = Math.ceil(sortedTimes.length / 20);
    const timesToMean = sortedTimes.slice(numToThrowOut, sortedTimes.length - numToThrowOut);
    const sumOfTimesToMean = timesToMean.reduce((sum, time) => sum + time, 0);
    return new Time(sumOfTimesToMean / timesToMean.length, penaltyTypes.NONE);
  };

  const getAverageOfNFromSortedTimeObjs = sortedTimeObjs => {
    const numToThrowOut = Math.ceil(sortedTimeObjs.length / 20);
    const slowestTimeObjNotThrownOut = sortedTimeObjs[sortedTimeObjs.length - numToThrowOut - 1];
    if(slowestTimeObjNotThrownOut && slowestTimeObjNotThrownOut.penaltyType === penaltyTypes.DNF) {
      return new Time(0, penaltyTypes.DNF);
    } else {
      return getAverageOfNFromSortedTimes(sortedTimeObjs.map(timeObj => timeObj.timeMillis));
    }
  };

  const calculateAoN = n => {
    let best = undefined;
    for(let i = n - 1; i < timeObjs.length; i++) {
      const lastNTimeObjs = getLastNTimeObjs(i, n);
      const lastNTimeObjsSorted = lastNTimeObjs.sort(compareSolves);
      const avg = getAverageOfNFromSortedTimeObjs(lastNTimeObjsSorted);
      timeObjs[i]['ao' + n] = avg;
      if(best === undefined || best.penaltyType === penaltyTypes.DNF || avg.timeMillis < best.timeMillis) {
        best = avg;
        bests['ao' + n] = timeObjs[i]['ao' + n];
      }
    }
  };

  bests.single = sortedTimeObjs[0];
  calculateMoN(3);
  calculateAoN(5);
  calculateAoN(12);
  calculateAoN(50);
  calculateAoN(100);

  const mean = timesWithoutDnfs.length > 0 ?
    new Time(timesWithoutDnfs.reduce((sum, time) => sum + time, 0) / timesWithoutDnfs.length, penaltyTypes.NONE) : NaN;
  const avg = sortedTimeObjs.length > 0 ? getAverageOfNFromSortedTimeObjs(sortedTimeObjs) : NaN;
  const sumOfPowers = timesWithoutDnfs.reduce((sum, time) => sum + Math.pow(time - mean.timeMillis, 2), 0);
  const std = sumOfPowers === 0.0 ? NaN :
    new Time(Math.sqrt(sumOfPowers / (timesWithoutDnfs.length - 1)), penaltyTypes.NONE);

  timeObjs
    .sort((a, b) => a.solveNumber - b.solveNumber)
    .forEach((timeObj, i) => solves[i].timeObj = timeObj);

  return { bests, solves, mean, avg, std };
};