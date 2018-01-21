const types = {
  222: '2x2x2',
  333: '3x3x3',
  444: '4x4x4',
  555: '5x5x5',
  666: '6x6x6',
  777: '7x7x7',
  clock: 'Clock',
  minx: 'Megaminx',
  pyram: 'Pyraminx',
  sq1: 'Square 1'
};

export const solveTypeToString = type => types[type];
export const getSolveTypeKeys = () => Object.keys(types);
export const getSolveTypeStrings = () => Object.values(types);