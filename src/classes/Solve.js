import Time from './Time'
import * as penaltyTypes from '../constants/penaltyTypes'

export default class Solve {
  constructor(scramble, timeObj, comment = '') {
    this.scramble = scramble;
    this.timeObj = timeObj;
    this.comment = comment;
  }

  setPenaltyType(penaltyType) {
    // TODO use setPenaltyType from Time class
    let newTime = this.timeObj.timeMillis;
    if(penaltyType === penaltyTypes.PLUS_TWO && this.timeObj.penaltyType !== penaltyTypes.PLUS_TWO) {
      newTime += 2000;
    } else if(penaltyType !== penaltyTypes.PLUS_TWO && this.timeObj.penaltyType === penaltyTypes.PLUS_TWO) {
      newTime -= 2000;
    }

    return new Solve(this.scramble, new Time(newTime, penaltyType), this.comment);
  }

  setComment(comment) {
    return new Solve(this.scramble, this.timeObj, comment);
  }
}