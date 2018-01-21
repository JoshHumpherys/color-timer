export default class Session {
  constructor(name, type, solves = []) {
    this.name = name;
    this.type = type;
    this.solves = solves;
  }

  addSolve(solve) {
    return new Session(this.name, this.type, [...this.solves, solve]);
  }

  setPenaltyType(penaltyType, solveIndex) {
    const newSolves = [...this.solves];
    newSolves[solveIndex] = newSolves[solveIndex].setPenaltyType(penaltyType);
    return new Session(this.name, this.type, newSolves);
  }
}