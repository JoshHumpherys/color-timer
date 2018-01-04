import React, { Component } from 'react'
import Scrambo from 'scrambo'

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

    const scrambo = new Scrambo();

    this.state = {
      scrambo,
      type: '333',
      scramble: scrambo.get()[0]
    };

    this.generateScramble = this.generateScramble.bind(this);
  }

  changeType(type) {
    this.setState({ type });
  }

  generateScramble(type) {
    this.setState({ scramble: this.state.scrambo.type(type).get() });
  }

  render() {
    return (
      <div className="app">
        <header className="header">
          <select className="type-dropdown" onChange={e => this.generateScramble(e.target.value)}>
            {
              Object.keys(types).map(key =>
                <option key={key} value={key} selected={this.state.type === key ? 'selected' : ''}>
                  {types[key]}
                </option>
              )
            }
          </select>
          <h1 className="scramble">{this.state.scramble}</h1>
        </header>
      </div>
    );
  }
}

export default App;
