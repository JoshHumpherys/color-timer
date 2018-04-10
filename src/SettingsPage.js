import React, { Component } from 'react'
import { connect } from 'react-redux'

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="app">
        Settings
      </div>
    );
  }
}

export default connect(
  state => {
    return {};
  }
)(SettingsPage);
