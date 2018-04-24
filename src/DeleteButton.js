import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

export default class DeleteButton extends Component {
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