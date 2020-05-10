import React, { Component } from 'react';
import './App.css';
import Controller from './components/Controller';
import Login from './components/Login';
import MPGame from './components/MPGame';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import WSocket from './components/WSocket';


class Game extends Component {
  state = {
    game: {
      name: 'No Game',
      numberOfPlayers: '0',
      playerUp: '',
      playerName: '',
      ballInPlay: '0',
      gameOver: true
    },
    user: {
    },
    loggedIn: false,
    connected: false,
    players: [
    ]
  }

  componentDidMount() {
    //get game and player info
    fetch('/api/games').then((response)=>{
        if(!response.ok){
          console.log('game not in progress');
        }else{
          return(response.json());
        }
    }).then((res)=>{
      this.setState({game: res});
    })

    fetch('/api/players').then((response)=>{
      if(!response.ok){
        console.log('game not in progress');
      }else{
        return(response.json());
      }
    }).then((res)=>{
      this.setState({players: res});
    })


    // establish websocket connection to backend server.
    let ws = new WebSocket('ws://' + window.location.host + '/api/socket');

    // create and assign a socket to a variable.
    let socket = this.socket = new WSocket(ws);

    // handle connect and discconnect events.
    socket.on('connect', this.onConnect);
    socket.on('disconnect', this.onDisconnect);

    /* EVENT LISTENERS */
    // event listener to handle 'hello' from a server
    socket.on('players', this.updatePlayers);
    socket.on('gamestate', this.updateGame);

    socket.on('message', this.rcvMessage);
                  
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
          console.log('logged in', window.location.host);

          this.setState({loggedIn: true});
          this.setState({user: {playerID: usr.user, pin: usr.pin}});
        }else {
          console.log('not logged in');
          this.setState({loggedIn: false});
        }
        //refresh player list anyway
        this.socket.emit('refreshPlayers','');
      }) ;
  }

  logout = () => {
    console.log('logging out');

    this.setState({user: {
      user: -1,
      pin: -1
    }, loggedIn: false});

    if(this.state.connected){
      console.log('disconnecting socket');
      this.socket.close();
    }


    console.log('logged out: ', this.loggedIn);
  }



  // onConnect sets the state to true indicating the socket has connected 
  //    successfully.
  onConnect = () => {
    console.log('websocket connected');
    this.setState({connected: true});

    //send player info
    //this.socket.emit('test',JSON.stringify(this.state.user));
  }

  // onDisconnect sets the state to false indicating the socket has been 
  //    disconnected.
  onDisconnect = () => {
    this.setState({connected: false});
  }


  //sendAction

  sendAction = (e) => {
    let ctl = {
      playerID: this.state.user.playerID,
      pin: this.state.user.pin,
      button: e.button,
      action: e.action,
    };
    
    this.socket.emit('action',JSON.stringify(ctl));
  }

  // helloFromClient is an event emitter that sends a hello message to the backend 
  //    server on the socket.
  helloFromClient = () => {
      console.log('saying hello...');
      this.socket.emit('helloFromClient', 'hello server!');
  }

  // helloFromServer is an event listener/consumer that handles hello messages 
  //    from the backend server on the socket.
  helloFromServer = (data) => {
      console.log('hello from server! message:', data);
  }

  updatePlayers = (playerList) => {
    console.log('updating player list:', playerList);
    var newList = JSON.parse(playerList);
    this.setState({players: newList});
  }

  updateGame = (gameState) => {
    console.log('update game state:', gameState);
    var newGame = JSON.parse(gameState);
    this.setState({game: newGame});
  }

  rcvMessage = (data) => {
    console.log('received this from the server:', data);
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
                {/* <Button onClick={()=>{this.socket.emit('refreshPlayers','')}}>Players</Button>
                <Button onClick={()=>{this.socket.emit('refreshGame','')}}>Game</Button> */}
              </Col>
            </Row>
            <Row>
              <Col>
                <MPGame game={this.state.game} players={this.state.players} />
              </Col>
            </Row>
          </Container>
          <Container>
            <Controller user={this.state.user} game={this.state.game} sendAction = {this.sendAction} />
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

export default Game;
