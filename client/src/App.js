import React, { Component } from 'react';
import './App.css';
import Controller from './components/Controller';
import Login from './components/Login';
import MPGame from './components/MPGame';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class App extends Component {
  state = {
    game: {
      id: 123,
      name: 'Mike Bossy',
      numberOfPlayers: 4,
      playerUp: '1',
      playerName: 'Joe Doe',
      ballInPlay: 2,
      gameOver: false
    },
    user: {
      playerID: '1',
      pin: 1234,
      bothFlippers: true
    },
    loggedIn: true
    ,
    players: [
      {
        id: '1',
        name: 'Joe Doe',
        signedIn: true
      },
      {
        id: '2',
        name: 'Jane Doe',
        signedIn: false
      },
      {
        id: '3',
        name: 'Jack',
        signedIn: false
      },
      {
        id: '4',
        name: 'Dianne',
        signedIn: true
      }
    ]
  }

  /*
  updateUser = (e) => {
    console.log('User: ', e.user, ' pin: ', e.pin);
    this.setState({user: {playerID: e.user, pin: e.pin}})
    this.setState({loggedIn: true})
  }
*/


  updateUser = (e) => {
    console.log('123 loginPlayer called:', e.user, ' pin ', e.pin);
    //fetch('/api/player/login');
    let usr = {user: e.user,
      pin: e.pin};


    fetch('/api/player/login', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usr)
      }).then((response) => {
        if(!response.ok) {
          console.log(response.text);
        }else{
          return(response.json());
        }
      }).then((rsp) => {
        if(rsp.loggedIn){
          console.log('logged in');
          //switch to using a websocket
          this.setState({loggedIn: true});
          this.setState({user: {playerID: usr.user, pin: usr.pin}});
        }else {
          console.log('not logged in');
          this.setState({loggedIn: false});
        }
      }) ;
  }

  logout = () => {
    console.log('logging out');
    this.setState({user: {
      user: -1,
      pin: -1
    }, loggedIn: false});
    console.log('logged out: ', this.loggedIn);
  }

  render() {
    console.log(this.state);
    if(this.state.loggedIn){
      console.log('logged in');
      return (
        <div className="App">
          <Container>
            <Row>
              <Col>
                <Button onClick={this.logout}>Logout</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <MPGame game={this.state.game} players={this.state.players} />
              </Col>
            </Row>
          </Container>
          <Container>
            <Controller user={this.state.user} game={this.state.game}/>
          </Container>
        </div>
      );  
    }else{
      console.log('not logged in');
      return (
        <div className="App">
          <MPGame game={this.state.game} players={this.state.players} />
          <Login players={this.state.players} updateUser = {this.updateUser} />
        </div>
      );  
    }
  }
}

export default App;
