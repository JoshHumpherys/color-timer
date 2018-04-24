import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

export default class SubmitButton extends Component {
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