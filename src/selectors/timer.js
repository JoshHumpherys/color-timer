export const getType = state => state.timer.type;
export const getScrambo = state => state.timer.scrambos[state.timer.type];
export const getScramble = state => state.timer.scramble;
export const getState = state => state.timer.state;
export const getInspectionStartTime = state => state.timer.inspectionStartTime;
export const getHoldingStartTime = state => state.timer.holdingStartTime;
export const getRunningStartTime = state => state.timer.runningStartTime;
export const getSpacebarIsDown = state => state.timer.spacebarIsDown;
export const getTimerJustStopped = state => state.timer.timerJustStopped;
export const getTime = state => state.timer.time;

export const getSolveStats = state => {
  const solves = state.timer.sessions[state.timer.currentSessionIndex].solves;
  const bests = {
    single: undefined,
    mo3: undefined,
    ao5: undefined,
    ao12: undefined,
    ao50: undefined,
    ao100: undefined
  };

  const getLastNTimes = (i, n) => solves.slice(i - (n - 1), i + 1).map(solve => solve.time);

  const getLastNTimesSorted = (i, n) => getLastNTimes(i, n).sort((a, b) => a - b);

  const getMeanOfN = times => times.reduce((sum, time) => sum + time, 0) / times.length;

  const calculateMoN = n => {
    let best = undefined;
    for(let i = n - 1; i < solves.length; i++) {
      const mean = getMeanOfN(getLastNTimes(i, n));
      solves[i]['mo' + n] = mean;
      if(best === undefined || mean < best) {
        bests['mo' + n] = best = mean;
      }
    }
  };

  const getAverageOfNFromSortedTimes = sortedTimes => {
    const numToThrowOut = Math.floor(sortedTimes.length / 5);
    const timesToMean = sortedTimes.slice(numToThrowOut, sortedTimes.length - numToThrowOut);
    const sumOfTimesToMean = timesToMean.reduce((sum, time) => sum + time, 0);
    return sumOfTimesToMean / timesToMean.length;
  };

  const calculateAoN = n => {
    let best = undefined;
    for(let i = n - 1; i < solves.length; i++) {
      const avg = getAverageOfNFromSortedTimes(getLastNTimesSorted(i, n));
      solves[i]['ao' + n] = avg;
      if(best === undefined || avg < best) {
        bests['ao' + n] = best = avg;
      }
    }
  };

  const times = solves.map(solve => solve.time);
  const sortedTimes = times.sort((a, b) => a - b);

  bests.single = times.length > 0 ? Math.min(...times) : undefined;
  calculateMoN(3);
  calculateAoN(5);
  calculateAoN(12);
  calculateAoN(50);
  calculateAoN(100);

  const mean = times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : NaN;
  const avg = sortedTimes.length > 0 ? getAverageOfNFromSortedTimes(sortedTimes) : NaN;
  const sumOfPowers = times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0);
  const std = Math.sqrt(sumOfPowers / (times.length - 1));

  return { bests, solves, mean, avg, std };
};