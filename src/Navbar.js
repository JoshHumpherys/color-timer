import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getColors } from './selectors/timer'

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const topBarStyle = { backgroundColor: this.props.colors.topBar, color: this.props.colors.topBarText };
    return (
      <header className="header" style={topBarStyle}>
        {this.props.children}
      </header>
    );
  }
}

export default connect(
  state => {
    return {
      colors: getColors(state)
    };
  }
)(Navbar);
