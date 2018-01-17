import * as penaltyTypes from '../constants/penaltyTypes'

export default class Time {
  constructor(timeMillis, penaltyType = penaltyTypes.NONE) {
    this.timeMillis = timeMillis;
    this.penaltyType = penaltyType;
  }

  setPenaltyType(penaltyType) {
    let newTime = this.timeMillis;
    if(penaltyType === penaltyTypes.PLUS_TWO && this.penaltyType !== penaltyTypes.PLUS_TWO) {
      newTime += 2000;
    } else if(penaltyType !== penaltyTypes.PLUS_TWO && this.penaltyType === penaltyTypes.PLUS_TWO) {
      newTime -= 2000;
    }
    return new Time(newTime, penaltyType);
  }
}