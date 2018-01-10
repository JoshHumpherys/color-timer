import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Dropdown, Modal } from 'semantic-ui-react'
import {
  setType,
  generateScramble,
  startInspection,
  startHolding,
  stopHolding,
  startTimer,
  stopTimer,
  setSpacebarIsDown
} from './actions/timer'
import { setDisplayMillis, setInspection, setHideSolveTime, setHoldTime } from './actions/settings'
import { createModal, removeModal } from './actions/modal'
import {
  getType,
  getScrambo,
  getScramble,
  getState,
  getInspectionStartTime,
  getHoldingStartTime,
  getRunningStartTime,
  getSpacebarIsDown,
  getTimerJustStopped,
  getTime
} from './selectors/timer'
import { getInspection, getHoldTimeType, getDisplayMillis, getHideSolveTime } from './selectors/settings'
import { getModalType } from './selectors/modal'
import * as stateTypes from './constants/stateTypes'
import * as holdTimeTypes from './constants/holdTimeTypes'
import * as modalTypes from './constants/modalTypes'

// TODO move these to a constants file?
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

// TODO move these to a constants file?
const holdTimes = {
  [holdTimeTypes.NONE]: 0,
  [holdTimeTypes.THREE_TENTHS_SECOND]: 0.3,
  [holdTimeTypes.STACK_MAT]: 0.55,
  [holdTimeTypes.ONE_SECOND]: 1
};

class SubmitButton extends Component {
  render() {
    return (
      <Button
        key="submit"
        positive
        icon="checkmark"
        labelPosition="right"
        content="Submit"
        onClick={this.props.onClick} />
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.setType = this.setType.bind(this);
    this.generateScramble = this.generateScramble.bind(this);
    this.getDisplayTime = this.getDisplayTime.bind(this);
    this.isReady = this.isReady.bind(this);
  }

  setType(type) {
    this.props.dispatch(setType(type));
    this.generateScramble(type);
  }

  generateScramble(type) {
    this.props.dispatch(generateScramble(type));
  }

  getDisplayTime(timeMillis) {
    const millis = timeMillis % 1000;
    const secs = Math.floor(timeMillis / 1000) % 60;
    const mins = Math.floor(timeMillis / 1000 / 60) % 60;
    const hrs = Math.floor(timeMillis / 1000 / 60 / 60);
    const getComponent = time => ((time < 10) ? '0' + time : time.toString()).slice(0, 2);
    const millisString = (millis < 10 ? '00' : (millis < 100 ? '0' : '')) + millis + '000';
    return (
      (hrs !== 0 ? hrs + ':' : '') +
      (mins !== 0 || hrs !== 0 ? (hrs !== 0 ? getComponent(mins) : mins) + ':' : '') +
      (secs !== 0 || mins !== 0 || hrs !== 0 ? (mins !== 0 || hrs !== 0 ? getComponent(secs) : secs) + '.' : '') +
      (secs === 0 && mins === 0 && hrs === 0 ? '0.' : '') +
      millisString.toString().slice(0, this.props.displayMillis ? 3 : 2)
    );
  }

  isReady(now) {
    return this.props.holdingStartTime !== null && now - this.props.holdingStartTime >= this.props.holdTime * 1000;
  }

  componentDidMount() {
    document.addEventListener('keydown', e => {
      if(e.keyCode === 32 && !this.props.spacebarIsDown) {
        this.props.dispatch(setSpacebarIsDown(true));
      }
    });
    document.addEventListener('keyup', e => {
      if(e.keyCode === 32 && this.props.spacebarIsDown) {
        this.props.dispatch(setSpacebarIsDown(false));
      }
    });
    setInterval(this.forceUpdate.bind(this), 20);
  }

  componentDidUpdate(prevProps) {
    const now = Date.now();
    if(this.props.spacebarIsDown && !prevProps.spacebarIsDown) {
      switch(this.props.state) {
        case stateTypes.IDLE:
          if(!this.props.inspection) {
            this.props.dispatch(startHolding(now));
          }
          break;
        case stateTypes.INSPECTION:
            this.props.dispatch(startHolding(now));
          break;
        case stateTypes.RUNNING:
            this.props.dispatch(stopTimer(now));
          break;
      }
    } else if(!this.props.spacebarIsDown && prevProps.spacebarIsDown) {
      switch(this.props.state) {
        case stateTypes.IDLE:
          if(!this.props.timerJustStopped) {
            if(this.props.inspection) {
              this.props.dispatch(startInspection(now));
            } else if(this.isReady(now)) {
              this.props.dispatch(startTimer(now));
            } else {
              this.props.dispatch(stopHolding());
            }
          }
          break;
        case stateTypes.INSPECTION:
          if(this.isReady(now)) {
            this.props.dispatch(startTimer(now));
          } else {
            this.props.dispatch(stopHolding());
          }
          break;
        case stateTypes.RUNNING:
          // Should never reach this state
          break;
      }
    }
    if(this.props.state === stateTypes.INSPECTION) {
      // TODO handle +2 and DNF during inspection
    }
  }

  render() {
    const now = Date.now();
    let displayTime;
    switch(this.props.state) {
      case stateTypes.IDLE:
        displayTime = this.getDisplayTime(this.props.time);
        break;
      case stateTypes.INSPECTION:
        const inspectionTimeRemaining = Math.ceil(15 - (now - this.props.inspectionStartTime) / 1000);
        console.log(this.props.inspectionStartTime);
        if(inspectionTimeRemaining > 0) {
          displayTime = inspectionTimeRemaining.toString();
        } else if(inspectionTimeRemaining > -2) {
          displayTime = '+2';
        } else {
          displayTime = 'DNF';
        }
        break;
      case stateTypes.RUNNING:
        if(this.props.hideSolveTime) {
          displayTime = 'Solving';
        } else {
          displayTime = this.getDisplayTime(Date.now() - this.props.runningStartTime);
        }
        break;
    }

    let displayTimeDivClassName = 'timer-text';
    if(displayTime.length >= 11) {
      displayTimeDivClassName += ' timer-text-smallest'
    } else if(displayTime.length >= 6) {
      displayTimeDivClassName += ' timer-text-small';
    } else if(displayTime.length >= 4) {
      displayTimeDivClassName += ' timer-text-medium';
    }

    let modalContents;
    switch(this.props.modalType) {
      case modalTypes.SETTINGS_MODAL:
        modalContents = {
          header: 'Settings',
          body: (
            <div>
              <div>
                <h4>Display Milliseconds</h4>
                <Checkbox
                  toggle
                  defaultChecked={this.props.displayMillis}
                  onChange={(e, data) => this.props.dispatch(setDisplayMillis(data.checked))}
                />
              </div>
              <br />
              <div>
                <h4>Inspection</h4>
                <Checkbox
                  toggle
                  defaultChecked={this.props.inspection}
                  onChange={(e, data) => this.props.dispatch(setInspection(data.checked))}
                />
              </div>
              <br />
              <div>
                <h4>Hide solve time</h4>
                <Checkbox
                  toggle
                  defaultChecked={this.props.hideSolveTime}
                  onChange={(e, data) => this.props.dispatch(setHideSolveTime(data.checked))}
                />
              </div>
              <br />
              <div>
                <h4>Hold time</h4>
                <Dropdown
                  defaultValue={this.props.holdTimeType}
                  fluid
                  selection
                  options={
                    [
                      { text: '0', value: holdTimeTypes.NONE },
                      { text: '0.3', value: holdTimeTypes.THREE_TENTHS_SECOND },
                      { text: '0.55', value: holdTimeTypes.STACK_MAT },
                      { text: '1', value: holdTimeTypes.ONE_SECOND }
                    ]
                  }
                  onChange={(e, data) => this.props.dispatch(setHoldTime(data.value))}
                />
              </div>
            </div>
          ),
          actions: <SubmitButton onClick={() => this.props.dispatch(removeModal())} />
        };
        break;
      default:
        modalContents = { header: null, body: null, actions: null };
    }

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
          <button className="header-button centered-text" onClick={
            () => this.props.dispatch(createModal(modalTypes.SETTINGS_MODAL))
          }>Settings</button>
        </header>
        <div className={'timer' + (this.isReady(now) ? ' ready' : '')}>
          <p className={displayTimeDivClassName}>
            {displayTime}
          </p>
        </div>

        <Modal size='small' open={this.props.modalType !== null} onClose={() => this.props.dispatch(removeModal())}>
          <Modal.Header>
            {this.props.modalType ? modalContents.header : null}
          </Modal.Header>
          <Modal.Content>
            {this.props.modalType ? modalContents.body : null}
          </Modal.Content>
          <Modal.Actions>
            {this.props.modalType ? modalContents.actions : null}
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => {
    const holdTimeType = getHoldTimeType(state);
    return {
      type: getType(state),
      scrambo: getScrambo(state),
      scramble: getScramble(state),
      state: getState(state),
      inspectionStartTime: getInspectionStartTime(state),
      holdingStartTime: getHoldingStartTime(state),
      runningStartTime: getRunningStartTime(state),
      spacebarIsDown: getSpacebarIsDown(state),
      timerJustStopped: getTimerJustStopped(state),
      time: getTime(state),
      inspection: getInspection(state),
      holdTimeType,
      holdTime: holdTimes[holdTimeType],
      displayMillis: getDisplayMillis(state),
      hideSolveTime: getHideSolveTime(state),
      modalType: getModalType(state)
    };
  }
)(App);
