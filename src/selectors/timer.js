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

export const getSolves = state => {
  const solves = state.timer.sessions[state.timer.currentSessionIndex].solves;

  const getLastNSolveTimesSorted = (i, n) => solves
    .slice(i - (n - 1), i + 1)
    .map(solve => solve.time)
    .sort((a, b) => a - b);

  const getAverageOfNFromSortedTimes = sortedTimes => {
    const numToThrowOut = Math.floor(sortedTimes.length / 5);
    const timesToMean = sortedTimes.slice(numToThrowOut, sortedTimes.length - numToThrowOut);
    const sumOfTimesToMean = timesToMean.reduce((sum, time) => sum + time, 0);
    return sumOfTimesToMean / timesToMean.length;
  };

  const calculateAoN = n => {
    for(let i = n - 1; i < solves.length; i++) {
      solves[i]['ao' + n] = getAverageOfNFromSortedTimes(getLastNSolveTimesSorted(i, n));
    }
  };

  calculateAoN(5);
  calculateAoN(12);

  return solves;
};