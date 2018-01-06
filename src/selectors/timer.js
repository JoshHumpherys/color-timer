export const getType = state => state.timer.type;
export const getScrambo = state => state.timer.scrambos[state.timer.type];
export const getScramble = state => state.timer.scramble;
export const getState = state => state.timer.state;
export const getHoldingStartTime = state => state.timer.holdingStartTime;
export const getTime = state => state.timer.time;