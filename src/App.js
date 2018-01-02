import React, { Component } from 'react'
import Scrambo from 'scrambo'

class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="header">
          <h1 className="title">Cube Timer</h1>
        </header>
        {new Scrambo().get(5).map(scramble => <p>{scramble}</p>)}
      </div>
    );
  }
}

export default App;
