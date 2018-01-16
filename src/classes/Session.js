export default class Session {
  constructor(name, solves = []) {
    this.name = name;
    this.timeObjs = solves;
  }

  addSolve(solve) {
    return new Session(this.name, [...this.timeObjs, solve]);
  }
}