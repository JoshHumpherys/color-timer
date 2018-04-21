import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Checkbox, Dropdown } from 'semantic-ui-react'
import { setDisplayMillis, setInspection, setHideSolveTime, setHoldTime, setShowTimes } from './actions/settings'
import { createSession, generateScramble, setColors, setColorScheme, setType, switchSession } from './actions/timer'
import { getColors, getCurrentSessionIndex, getCurrentSessions, getType, getColorScheme } from './selectors/timer'
import { getDisplayMillis, getHideSolveTime, getHoldTimeType, getInspection, getShowTimes } from './selectors/settings'
import * as holdTimeTypes from './constants/holdTimeTypes'
import colorSchemes from './constants/colorSchemes'
import { solveTypeToString, getSolveTypeKeys } from './constants/solveTypeToString'
import logo from './img/logo.png'

import Navbar from './Navbar'

// TODO move these to a constants file?
const holdTimes = {
  [holdTimeTypes.NONE]: 0,
  [holdTimeTypes.THREE_TENTHS_SECOND]: 0.3,
  [holdTimeTypes.STACK_MAT]: 0.55,
  [holdTimeTypes.ONE_SECOND]: 1
};

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.setType = this.setType.bind(this);
    this.generateScramble = this.generateScramble.bind(this);
    this.createSession = this.createSession.bind(this);
  }

  setType(type) {
    this.props.dispatch(setType(type));
    this.generateScramble(type);
  }

  generateScramble(type) {
    this.props.dispatch(generateScramble(type));
  }

  createSession() {
    this.props.dispatch(createSession(this.newSessionInputField.value));
  }

  render() {
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

    const buttonStyle = { backgroundColor: this.props.colors.buttons, color: this.props.colors.buttonsText };

    return (
      <div className="app">
        <Navbar>
          <img src={logo} className="logo" alt="logo" />
          <h1 className="scramble">Settings</h1>
          <div className="header-buttons-container">
            <div className="header-buttons-container-top">
              <button className="header-button centered-text" onClick={
                () => browserHistory.push('/')
              } style={buttonStyle}>Back</button>
            </div>
          </div>
        </Navbar>
        <div className="settings">
          <h2>Solve Type</h2>
          <Dropdown
            defaultValue={this.props.type}
            fluid
            selection
            options={getSolveTypeKeys().map(key => ({ text: solveTypeToString(key), value: key }))}
            onChange={(e, data) => this.setType(data.value)}
          />
          <h2>Sessions</h2>
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
                    }} />
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
          <h2>Timer</h2>
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
          <h2>Colors</h2>
          <div>
            <h4>Color Scheme</h4>
            <Dropdown
              defaultValue={this.props.colorScheme}
              fluid
              selection
              upward={this.props.colorScheme !== 'CUSTOM'}
              options={
                colorSchemes.map(colorScheme => ({ text: colorScheme.name, value: colorScheme.value }))
              }
              onChange={(e, data) => this.props.dispatch(setColorScheme(data.value))}
            />
          </div>
          <br />
          {
            this.props.colorScheme === 'CUSTOM' ? (
              colors.map((color, i) => (
                <div key={color.key}>
                  { i !== 0 ? <br /> : undefined }
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
            ) : (
              <br />
            )
          }
        </div>
      </div>
    );
  }
}

export default connect(
  state => {
    const holdTimeType = getHoldTimeType(state);
    return {
      type: getType(state),
      colors: getColors(state),
      colorScheme: getColorScheme(state),
      sessions: getCurrentSessions(state),
      currentSessionIndex: getCurrentSessionIndex(state),
      inspection: getInspection(state),
      holdTimeType,
      holdTime: holdTimes[holdTimeType],
      displayMillis: getDisplayMillis(state),
      hideSolveTime: getHideSolveTime(state),
      showTimes: getShowTimes(state)
    };
  }
)(SettingsPage);
