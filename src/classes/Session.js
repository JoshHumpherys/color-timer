export default class Session {
  constructor(name, solves = []) {
    this.name = name;
    this.solves = solves;
  }

  addSolve(solve) {
    return new Session(this.name, [...this.solves, solve]);
  }
}