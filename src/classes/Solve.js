export default class Solve {
  constructor(scramble, timeObj, comment = '') {
    this.scramble = scramble;
    this.timeObj = timeObj;
    this.comment = comment;
  }

  setPenalty(penaltyType) {
    return new Solve(this.scramble, this.timeObj.setPenalty(penaltyType), this.comment);
  }

  setComment(comment) {
    return new Solve(this.scramble, this.timeObj, comment);
  }
}