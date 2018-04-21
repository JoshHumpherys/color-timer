import React, { Component } from 'react'

export default class TimerText extends Component {
  componentDidMount() {
    this.setState({ interval: setInterval(this.forceUpdate.bind(this), 20) });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    return (
      <p className={this.props.className} style={this.props.style}>
        {this.props.displayTime}
      </p>
    );
  }
}