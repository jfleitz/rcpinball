import React, { Component } from 'react';
import './App.css';
import Match from './components/Match';
import Controller from './components/Controller';

class App extends Component {
  state = {
    game: {
      id: 123,
      name: 'Mike Bossy',
      numberOfPlayers: 4,
      playerID: 1,
      playerName: 'Jack',
      ballInPlay: 2
    },
    user: {
      playerID: 1,
      pin: 1234,
      bothFlippers: true
    }
    ,
    players: [
      {
        id: 1,
        name: 'Joe Doe',
        signedIn: false
      },
      {
        id: 2,
        name: 'Jane Doe',
        signedIn: false
      },
      {
        id: 3,
        name: 'Jack',
        signedIn: false
      },
      {
        id: 4,
        name: 'Dianne',
        signedIn: true
      }
    ]
  }
  render() {
    return (
      <div className="App">
        <Match game={this.state.game} players={this.state.players} />
        <Controller user={this.state.user} playerUp={this.state.game.currentPlayer}/>
      </div>
    );  
  }
}

export default App;
