import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Dropdown, Form, Modal, Radio } from 'semantic-ui-react'
import {
  setType,
  generateScramble,
  startInspection,
  setCurrentPenaltyType,
  startHolding,
  stopHolding,
  startTimer,
  stopTimer,
  setSpacebarIsDown,
  setTouchDown,
  deleteSolve,
  createSession,
  switchSession,
  deleteCurrentSession,
  setPenaltyType,
  setColors,
  initFromLocalStorage
} from './actions/timer'
import { setDisplayMillis, setInspection, setHideSolveTime, setHoldTime, setShowTimes } from './actions/settings'
import { createModal, removeModal, setModalState } from './actions/modal'
import {
  getType,
  getScrambo,
  getScramble,
  getState,
  getInspectionStartTime,
  getHoldingStartTime,
  getRunningStartTime,
  getSpacebarDown,
  getTouchDown,
  getTimerJustStopped,
  getTimeObj,
  getPenaltyType,
  getColors,
  getCurrentSessions,
  getCurrentSessionIndex,
  getSolveStats
} from './selectors/timer'
import { getInspection, getHoldTimeType, getDisplayMillis, getHideSolveTime, getShowTimes } from './selectors/settings'
import { getModalType, getModalState } from './selectors/modal'
import * as stateTypes from './constants/stateTypes'
import * as holdTimeTypes from './constants/holdTimeTypes'
import * as penaltyTypes from './constants/penaltyTypes'
import * as modalTypes from './constants/modalTypes'
import { solveTypeToString, getSolveTypeKeys } from './constants/solveTypeToString'
import logo from './img/logo.png';

import BarChart from 'barchart'

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
        content={this.props.text || 'Submit'}
        onClick={this.props.onClick} />
    );
  }
}

class DeleteButton extends Component {
  render() {
    return (
      <Button
        negative
        icon="trash"
        labelPosition="right"
        content="Delete"
        onClick={this.props.onClick} />
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.setType = this.setType.bind(this);
    this.generateScramble = this.generateScramble.bind(this);
    this.getDisplayTime = this.getDisplayTime.bind(this);
    this.isReady = this.isReady.bind(this);
    this.createSession = this.createSession.bind(this);
    this.removeBarChart = this.removeBarChart.bind(this);
    this.createBarChart = this.createBarChart.bind(this);
    this.updateBarChart = this.updateBarChart.bind(this);
    this.getChartTime = this.getChartTime.bind(this);
  }

  setType(type) {
    this.props.dispatch(setType(type));
    this.generateScramble(type);
  }

  generateScramble(type) {
    this.props.dispatch(generateScramble(type));
  }

  getDisplayTime(timeMillis, penaltyType = penaltyTypes.NONE) {
    if(timeMillis === undefined) return '';
    if(isNaN(timeMillis)) return '';
    if(penaltyType === penaltyTypes.DNF) return 'DNF';
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
      millisString.toString().slice(0, this.props.displayMillis ? 3 : 2) +
      (penaltyType === penaltyTypes.PLUS_TWO ? '+' : '')
    );
  }

  static getPenaltyType(timeMillis) {
    if(timeMillis > 0) {
      return penaltyTypes.NONE;
    } else if(timeMillis > -2) {
      return penaltyTypes.PLUS_TWO;
    } else {
      return penaltyTypes.DNF;
    }
  }

  static getInspectionDisplayTime(inspectionTimeRemaining, penaltyType) {
    switch(penaltyType) {
      case penaltyTypes.NONE:
        return inspectionTimeRemaining.toString();
      case penaltyTypes.PLUS_TWO:
        return '+2';
      case penaltyTypes.DNF:
        return 'DNF';
      default:
        return inspectionTimeRemaining.toString();
    }
  }

  isReady(now) {
    return this.props.holdingStartTime !== null && now - this.props.holdingStartTime >= this.props.holdTime * 1000;
  }

  createSession() {
    this.props.dispatch(createSession(this.newSessionInputField.value));
  }

  removeBarChart() {
    const container = document.getElementById('chart-container');
    if(container) {
      while(container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
    this.setState({ bc: undefined });
  }

  createBarChart() {
    this.removeBarChart();
    return new BarChart({
      barColors: [this.props.colors.buttons],
      labelTopColors: ['#FFF'],
      labelInsideColors: ['#FFF'],
      autoScale: true,
      chartPadding: 20,
      minimum: 0,
      maximum: 0,
      container: document.getElementById('chart-container')
    });
  }

  getChartTime(time) {
    if(time === undefined) return 0;
    if(isNaN(time)) return 0;
    const secs = Math.floor(time) % 60;
    const mins = Math.floor(time / 60) % 60;
    const hrs = Math.floor(time / 60 / 60);
    const getComponent = time => ((time < 10) ? '0' + time : time.toString()).slice(0, 2);
    return (
      (hrs !== 0 ? hrs + ':' : '') +
      (mins !== 0 || hrs !== 0 ? (hrs !== 0 ? getComponent(mins) : mins) + ':' : '') +
      (mins !== 0 || hrs !== 0 ? getComponent(secs) : secs)
    );
  }

  updateBarChart() {
    if(this.props.solves.length === 0) {
      this.removeBarChart();
      return;
    }
    const std = this.props.std.timeMillis / 1000 || 1;
    const flooredStd = Math.floor(std);
    let step, mean;
    if(flooredStd < 5) {
      step = Math.max(flooredStd, 1);
      mean = Math.floor(this.props.mean.timeMillis / 1000) || 1;
    } else {
      step = 5 * Math.floor(flooredStd / 5);
      mean = (step * Math.floor(this.props.mean.timeMillis / 1000 / step)) || 1;
    }
    const numPartitions = step === 1 ? 4 : 3;
    const start = Math.max(mean, numPartitions * step);
    let { bc } = this.state;
    if(bc === undefined || this.state.lastStep !== step || this.state.lastStart !== start) {
      bc = this.createBarChart();
      this.setState({ lastStep: step, lastStart: start, bc });
    }
    const categories = [];
    for(let i = -numPartitions; i <= numPartitions; i++) {
      categories.push(start + step * i);
    }

    let largestCategoryCount = 0;
    const data = categories.map(category => {
      const count = this.props.solves.filter(solve => {
        const solveTime = solve.timeObj.timeMillis / 1000;
        return solveTime >= category && solveTime < category + step;
      }).length;
      largestCategoryCount = Math.max(largestCategoryCount, count);
      return {
        name: this.getChartTime(category) + (step === 1 ? '' : '-' + (this.getChartTime(category + step))),
        value: count
      };
    });

    console.log(data);

    bc.maximum = Math.max(Math.floor(largestCategoryCount * 1.5), 2); // TODO don't mutate state

    bc.data([data]);
  }

  componentDidMount() {
    const sessions = JSON.parse(localStorage.getItem('sessions'));
    const type = JSON.parse(localStorage.getItem('type'));
    const currentSessionIndex = JSON.parse(localStorage.getItem('currentSessionIndex'));
    const settings = JSON.parse(localStorage.getItem('settings'));
    const colors = JSON.parse(localStorage.getItem('colors'));
    if(sessions !== null && type !== null && currentSessionIndex !== null && settings !== null && colors !== null) {
      this.props.dispatch(initFromLocalStorage(sessions, type, currentSessionIndex, settings, colors));
    }
    document.addEventListener('keydown', e => {
      if(e.keyCode === 32 && !this.props.spacebarDown) {
        this.props.dispatch(setSpacebarIsDown(true));
        e.preventDefault();
      } else if(this.props.state === stateTypes.RUNNING) {
        this.props.dispatch(stopTimer(Date.now()));
        e.preventDefault();
      }
    });
    document.addEventListener('keyup', e => {
      if(e.keyCode === 32 && this.props.spacebarDown) {
        this.props.dispatch(setSpacebarIsDown(false));
        e.preventDefault();
      }
    });
    this.timerTextContainer.addEventListener('touchstart', e => {
      this.props.dispatch(setTouchDown(true));
      e.preventDefault();
    });
    this.timerTextContainer.addEventListener('touchend', e => {
      this.props.dispatch(setTouchDown(false));
      e.preventDefault();
    });

    setInterval(this.forceUpdate.bind(this), 20);
  }

  componentDidUpdate(prevProps) {
    const now = Date.now();
    if((this.props.spacebarDown && !prevProps.spacebarDown) || (this.props.touchDown && !prevProps.touchDown)) {
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
        default:
          console.trace();
          // Should never reach this case
          break;
      }
    } else if((!this.props.spacebarDown && prevProps.spacebarDown) || (!this.props.touchDown && prevProps.touchDown)) {
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
          console.trace();
          // Should never reach this case
          break;
        default:
          console.trace();
          // Should never reach this case
          break;
      }
    }
    if(this.props.state === stateTypes.INSPECTION || this.props.state === stateTypes.READY) {
      const inspectionTimeRemaining = Math.ceil(15 - (now - this.props.inspectionStartTime) / 1000);
      const penaltyType = App.getPenaltyType(inspectionTimeRemaining);
      if(penaltyType !== this.props.penaltyType) {
        switch (penaltyType) {
          case penaltyTypes.NONE:
            break;
          case penaltyTypes.PLUS_TWO:
          case penaltyTypes.DNF:
            this.props.dispatch(setCurrentPenaltyType(penaltyType));
            break;
          default:
            // Should never reach this case
            console.trace();
            break;
        }
      }
    }
    if(!this.props.showTimes && prevProps.showTimes) {
      this.removeBarChart();
    }
    if((this.props.solves.length !== prevProps.solves.length && this.props.showTimes) || (
      this.props.showTimes && !prevProps.showTimes)) {
      this.updateBarChart();
    }
  }

  render() {
    const now = Date.now();
    let displayTime;
    switch(this.props.state) {
      case stateTypes.IDLE:
        displayTime = this.getDisplayTime(this.props.timeObj.timeMillis, this.props.timeObj.dnf);
        break;
      case stateTypes.INSPECTION:
        const inspectionTimeRemaining = Math.ceil(15 - (now - this.props.inspectionStartTime) / 1000);
        const penaltyType = App.getPenaltyType(inspectionTimeRemaining);
        displayTime = App.getInspectionDisplayTime(inspectionTimeRemaining, penaltyType);
        break;
      case stateTypes.RUNNING:
        if(this.props.hideSolveTime) {
          displayTime = 'Solving';
        } else {
          displayTime = this.getDisplayTime(Date.now() - this.props.runningStartTime);
        }
        break;
      default:
        console.trace();
        // Should never reach this case
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

    const colors = [
      { title: 'Top bar background color', key: 'topBar' },
      { title: 'Top bar text color', key: 'topBarText' },
      { title: 'Side bar background color', key: 'sideBar' },
      { title: 'Side bar text color', key: 'sideBarText' },
      { title: 'Buttons background color', key: 'buttons' },
      { title: 'Buttons text color', key: 'buttonsText' },
      { title: 'Timer background color', key: 'background' },
      { title: 'Timer text color', key: 'backgroundText' }
    ];

    // TODO move this to another file
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
                <h4>Display stats</h4>
                <Checkbox
                  toggle
                  defaultChecked={this.props.showTimes}
                  onChange={(e, data) => this.props.dispatch(setShowTimes(data.checked))}
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
              {
                colors.map(color => (
                  <div key={color.key}>
                    <br />
                    <div>
                      <h4>{color.title}</h4>
                      <input
                        type="color"
                        value={this.props.colors[color.key]}
                        onChange={
                          e => this.props.dispatch(setColors({ ...this.props.colors, [color.key]: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                ))
              }
            </div>
          ),
          actions: <SubmitButton onClick={() => this.props.dispatch(removeModal())} />
        };
        break;
      case modalTypes.SESSIONS_MODAL:
        modalContents = {
          header: solveTypeToString(this.props.type) + ' Sessions',
          body: (
            <div>
              <div>
                <h4>Create Session</h4>
                <div className="field">
                  <div className="ui input">
                    <input
                      ref={input => this.newSessionInputField = input}
                      type="text"
                      placeholder="Enter new session name"
                      autoComplete="off"
                      onKeyDown={e => {
                        if(e.keyCode === 13) {
                          this.createSession();
                        }
                      }}
                      autoFocus />
                  </div>
                  <button className="ui button" onClick={this.createSession}>Create Session</button>
                </div>
              </div>
              <br />
              <div>
                <h4>Current Session</h4>
                <Dropdown
                  key={'session dropdown' + this.props.currentSessionIndex} // TODO find a better way to update default
                  defaultValue={this.props.currentSessionIndex}
                  fluid
                  selection
                  options={this.props.sessions.map((session, i) => ({ text: session.name, value: i }))}
                  onChange={(e, data) => this.props.dispatch(switchSession(data.value))}
                />
              </div>
            </div>
          ),
          actions: [
            <DeleteButton key="deleteButton" onClick={() => {
              this.props.dispatch(deleteCurrentSession());
              this.props.dispatch(removeModal());
            }} />,
            <SubmitButton key="submitButton" onClick={() => this.props.dispatch(removeModal())} />
          ]
        };
        break;
      case modalTypes.SOLVE_MODAL:
        const { solveNumber } = this.props.modalState;
        const solve = solveNumber !== undefined ? this.props.solves[solveNumber] : undefined;
        const scramble = solve ? solve.scramble : '';
        const penaltyType = solve ? solve.timeObj.penaltyType : '';
        const radioChanged = (e, { value }) => this.props.dispatch(setPenaltyType(value, solveNumber));
        modalContents = {
          header: 'Solve #' + (this.props.modalState.solveNumber + 1),
          body: (
            <div>
              <div>
                <h4>Scramble</h4>
                <div>{scramble}</div>
              </div>
              <br />
              <div>
                <h4>Penalty</h4>
                <div>
                  <Form>
                    <Form.Field>
                      <Radio
                        label='None'
                        name='penalty'
                        value={penaltyTypes.NONE}
                        checked={penaltyType === penaltyTypes.NONE}
                        onChange={radioChanged}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label='+2'
                        name='penalty'
                        value={penaltyTypes.PLUS_TWO}
                        checked={penaltyType === penaltyTypes.PLUS_TWO}
                        onChange={radioChanged}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label='DNF'
                        name='penalty'
                        value={penaltyTypes.DNF}
                        checked={penaltyType === penaltyTypes.DNF}
                        onChange={radioChanged}
                      />
                    </Form.Field>
                  </Form>
                </div>
              </div>
            </div>
          ),
          actions: [
            <DeleteButton onClick={() => {
              this.props.dispatch(deleteSolve(solveNumber));
              this.props.dispatch(removeModal());
            }} />,
            <SubmitButton text="Done" onClick={() => this.props.dispatch(removeModal())} />
          ]
        };
        break;
      default:
        modalContents = { header: null, body: null, actions: null };
    }

    const getCurrentStat = type => {
      if(this.props.solves.length > 0) {
        const currentTimeObj = this.props.solves[this.props.solves.length - 1].timeObj;
        if(type === 'single') {
          return this.getDisplayTime(currentTimeObj.timeMillis, currentTimeObj.penaltyType);
        } else if(currentTimeObj[type]) {
          return this.getDisplayTime(currentTimeObj[type].timeMillis, currentTimeObj[type].penaltyType);
        } else {
          return '';
        }
      } else {
        return ''
      }
    };

    const buttonStyle = { backgroundColor: this.props.colors.buttons, color: this.props.colors.buttonsText };
    const topBarStyle = { backgroundColor: this.props.colors.topBar, color: this.props.colors.topBarText };
    const sideBarStyle = { backgroundColor: this.props.colors.sideBar, color: this.props.colors.sideBarText };
    const backgroundStyle = { backgroundColor: this.props.colors.background, color: this.props.colors.backgroundText };

    return (
      <div className="app">
        <header className="header" style={topBarStyle}>
          <img src={logo} className="logo" alt="logo" />
          <h1 className="scramble">{this.props.scramble}</h1>
          <div className="header-buttons-container">
            {/* TODO move these to a separate settings page
              <div className="header-buttons-container-top">
                <button className="header-button centered-text" onClick={
                  () => alert('TODO export solves')
                } style={buttonStyle}>Export</button>
                <select
                  className="header-button"
                  onChange={e => this.setType(e.target.value)}
                  value={this.props.type}
                  style={buttonStyle}>
                  {
                    getSolveTypeKeys().map(key =>
                      <option key={key} value={key}>
                        {solveTypeToString(key)}
                      </option>
                    )
                  }
                </select>
                <button className="header-button centered-text" onClick={
                  () => this.generateScramble(this.props.type)
                } style={buttonStyle}>Next</button>
              </div>
              <div className="header-buttons-container-bottom">
                <button className="header-button centered-text" onClick={
                  () => alert('TODO import solves')
                } style={buttonStyle}>Import</button>
                <button className="header-button centered-text" onClick={
                  () => this.props.dispatch(createModal(modalTypes.SESSIONS_MODAL))
                } style={buttonStyle}>Sessions</button>
                <button className="header-button centered-text" onClick={
                  () => this.props.dispatch(createModal(modalTypes.SETTINGS_MODAL))
                } style={buttonStyle}>Settings</button>
              </div>
            */}
            <div className="header-buttons-container-top">
              <button className="header-button centered-text" onClick={
                () => this.generateScramble(this.props.type)
              } style={buttonStyle}>Next</button>
              <button className="header-button centered-text" onClick={
                () => this.props.dispatch(createModal(modalTypes.SETTINGS_MODAL))
              } style={buttonStyle}>Settings</button>
            </div>
          </div>
        </header>
        <div className={'timer' + (this.isReady(now) ? ' ready' : '')}>
          {
            this.props.showTimes ? (
              <div className="timer-times-container" style={sideBarStyle}>
                <div id="chart-container" />
                <table className="timer-times-table">
                  <tbody>
                    <tr>
                      <th />
                      <th>Current</th>
                      <th>Best</th>
                    </tr>
                    {
                      Object.entries(this.props.bests).filter(([_, timeObj]) => timeObj).map(([ type, timeObj ]) => (
                        <tr key={type}>
                          <td>
                            {type}
                          </td>
                          <td>
                            {getCurrentStat(type)}
                          </td>
                          <td>
                            {timeObj ? this.getDisplayTime(timeObj.timeMillis, timeObj.penaltyType) : ''}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <h4 className="timer-times-mean">
                  Mean: {
                    this.props.mean ? this.getDisplayTime(this.props.mean.timeMillis, this.props.mean.penaltyType) : ''
                  }
                </h4>
                <h4 className="timer-times-avg">
                  Average: {
                    this.props.avg ? this.getDisplayTime(this.props.avg.timeMillis, this.props.avg.penaltyType) : ''
                  }
                </h4>
                <h4 className="timer-times-avg">
                  Standard Deviation: {
                    this.props.std ? this.getDisplayTime(this.props.std.timeMillis, this.props.std.penaltyType) : ''
                }
                </h4>
                <table className="timer-times-table">
                  <tbody>
                    <tr>
                      <th>Solve</th>
                      <th>Time</th>
                      <th>Ao5</th>
                      <th>Ao12</th>
                    </tr>
                    {
                      this.props.solves.map((solve, i) => (
                        <tr key={'solve' + i}>
                          <td>
                            <span className="solve-number" onClick={() => {
                              this.props.dispatch(createModal(modalTypes.SOLVE_MODAL));
                              this.props.dispatch(setModalState({ solveNumber: i }));
                            }}>
                              {i + 1}
                            </span>
                          </td>
                          <td>
                            {this.getDisplayTime(solve.timeObj.timeMillis, solve.timeObj.penaltyType)}
                          </td>
                          <td>
                            {
                              solve.timeObj.ao5 ?
                                this.getDisplayTime(solve.timeObj.ao5.timeMillis, solve.timeObj.ao5.penaltyType) : ''
                            }
                          </td>
                          <td>
                            {
                              solve.timeObj.ao12 ? this.getDisplayTime(
                                solve.timeObj.ao12.timeMillis,
                                solve.timeObj.ao12.penaltyType
                              ) : ''
                            }
                          </td>
                        </tr>
                      )).reverse()
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              undefined
            )
          }
          <div
            ref={timerTextContainer => this.timerTextContainer = timerTextContainer}
            className="timer-text-container"
            style={this.isReady(now) ? {} : backgroundStyle}> {/* TODO fix animation */}
            <p className={displayTimeDivClassName}>
              {displayTime}
            </p>
          </div>
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
    const solveStats = getSolveStats(state);
    return {
      type: getType(state),
      scrambo: getScrambo(state),
      scramble: getScramble(state),
      state: getState(state),
      inspectionStartTime: getInspectionStartTime(state),
      holdingStartTime: getHoldingStartTime(state),
      runningStartTime: getRunningStartTime(state),
      spacebarDown: getSpacebarDown(state),
      touchDown: getTouchDown(state),
      timerJustStopped: getTimerJustStopped(state),
      timeObj: getTimeObj(state),
      penaltyType: getPenaltyType(state),
      colors: getColors(state),
      sessions: getCurrentSessions(state),
      currentSessionIndex: getCurrentSessionIndex(state),
      bests: solveStats.bests,
      solves: solveStats.solves,
      mean: solveStats.mean,
      avg: solveStats.avg,
      std: solveStats.std,
      inspection: getInspection(state),
      holdTimeType,
      holdTime: holdTimes[holdTimeType],
      displayMillis: getDisplayMillis(state),
      hideSolveTime: getHideSolveTime(state),
      showTimes: getShowTimes(state),
      modalType: getModalType(state),
      modalState: getModalState(state)
    };
  }
)(App);
