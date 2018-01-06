import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setType, generateScramble, setState, startHolding, stopHolding, startTimer, stopTimer } from './actions/timer'
import { getType, getScrambo, getScramble, getState, getHoldingStartTime, getTime } from './selectors/timer'
import * as stateTypes from './constants/stateTypes'

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
  sq1: 'Square 1',
  skewb: 'Skewb'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.setType = this.setType.bind(this);
    this.generateScramble = this.generateScramble.bind(this);
  }

  setType(type) {
    this.props.dispatch(setType(type));
    this.generateScramble(type);
  }

  generateScramble(type) {
    this.props.dispatch(generateScramble(type));
  }

  componentDidMount() {
    document.addEventListener('keydown', e => {
      if(e.keyCode === 32) {
        const now = Date.now();
        if(this.props.state === stateTypes.IDLE) {
          this.props.dispatch(startHolding(now));
        } else if(this.props.state === stateTypes.RUNNING) {
          this.props.dispatch(stopTimer(now))
        } else if(now - this.props.holdingStartTime >= 0.5) {
          // TODO put hold time in settings
          // TODO handle if hold time is less than the time it takes keydown to repetitively fire
          this.props.dispatch(setState(stateTypes.READY));
        }
      }
    });
    document.addEventListener('keyup', e => {
      if(e.keyCode === 32) {
        const now = Date.now();
        if(this.props.state === stateTypes.READY) {
          this.props.dispatch(startTimer(now));
        } else {
          this.props.dispatch(stopHolding());
        }
      }
    });
  }

  render() {
    return (
      <div className="app">
        <header className="header">
          <select className="header-button" onChange={e => this.setType(e.target.value)}>
            {
              Object.keys(types).map(key =>
                <option key={key} value={key} selected={this.props.type === key ? 'selected' : ''}>
                  {types[key]}
                </option>
              )
            }
          </select>
          <button className="header-button centered-text" onClick={e => this.generateScramble(this.props.type)}>
            Next
          </button>
          <h1 className="scramble">{this.props.scramble}</h1>
        </header>
        <div className={'timer' + (this.props.state === stateTypes.READY ? ' ready' : '')}>
          <p className="timer-text">{this.props.state === stateTypes.RUNNING ? 'Solving' : this.props.time / 1000}</p>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    type: getType(state),
    scrambo: getScrambo(state),
    scramble: getScramble(state),
    state: getState(state),
    holdingStartTime: getHoldingStartTime(state),
    time: getTime(state)
  })
)(App);
