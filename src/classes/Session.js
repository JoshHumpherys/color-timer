export default class Session {
  constructor(name, solves = []) {
    this.name = name;
    this.solves = solves;
  }

  addSolve(solve) {
    return new Session(this.name, [...this.solves, solve]);
  }

  setPenaltyType(penaltyType, solveIndex) {
    const newSolves = [...this.solves];
    newSolves[solveIndex] = newSolves[solveIndex].setPenaltyType(penaltyType);
    return new Session(this.name, newSolves);
  }
}