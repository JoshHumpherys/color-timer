import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getColors } from './selectors/timer'

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const topBarStyle = {
      background: 'linear-gradient(to right, ' + this.props.colors.topBarLeft + ', ' + this.props.colors.topBarRight + ')',
      color: this.props.colors.topBarText
    };
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
