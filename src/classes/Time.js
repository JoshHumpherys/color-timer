import * as penaltyTypes from '../constants/penaltyTypes'

export default class Time {
  constructor(timeMillis, penaltyType = penaltyTypes.NONE) {
    this.timeMillis = timeMillis;
    this.penaltyType = penaltyType;
  }

  setPenalty(penaltyType) {
    return new Time(this.timeMillis, penaltyType);
  }
}