import React, { Component } from 'react';
import './Game.css';
import Controller from './components/Controller';
import Login from './components/Login';
import MPGame from './components/MPGame';
import { Toast, Button } from 'react-bootstrap';
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
    ],
    loginError: ''
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

    this.loginUser();

    // establish websocket connection to backend server.
    let ws = new WebSocket('ws://' + window.location.host + '/api/socket');

    // create and assign a socket to a variable.
    let socket = this.socket = new WSocket(ws);

    // handle connect and discconnect events.
    socket.on('connect', this.onConnect);
    socket.on('disconnect', this.onDisconnect);
    socket.on('players', this.updatePlayers);
    socket.on('gamestate', this.updateGame);

    socket.on('message', this.rcvMessage);
                  
  }


  loginUser(){
    console.log("trying to log in");
    this.setState({loginError: ""});
    try{
      let localUser=localStorage.getItem("user");

      var prevUser = JSON.parse(localUser);
      if (prevUser != "") {
        this.updateUser(prevUser);
      }
    }
      catch(err){
        console.log("error was: ", err);
      }

    
  }

  updateUser = (e) => {
    let usr = {user: e.playerID,
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
          console.log("response was not ok");
          this.setState({loginError: 'check user/pin'});
          this.setState({user: {
            user: -1,
            pin: -1
          }, loggedIn: false});
        }else{
          return(response.json());
        }
      }).then((rsp) => {
        if(rsp.loggedIn){
          console.log('logged in', window.location.host);

          this.setState({loggedIn: true});
          this.setState({user: {playerID: usr.user, pin: usr.pin}});

          localStorage.setItem("user", JSON.stringify(this.state.user));

        }else {
          console.log('not logged in');
          this.setState({user: {
            user: -1,
            pin: -1
          }, loggedIn: false});
          this.setState({loginError: 'could not log in'});
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

    /*
    if(this.state.connected){
      console.log('disconnecting socket');
      this.socket.close();
      this.setState({connected: false});
    }*/


    localStorage.removeItem("user");
  }



  // onConnect sets the state to true indicating the socket has connected successfully.
  onConnect = () => {
    console.log('websocket connected');
    this.setState({connected: true});
  }

  // onDisconnect sets the state to false indicating the socket has been disconnected.
  onDisconnect = () => {
    this.setState({connected: false});
  }


  //sendAction tells the server what button was pressed
  sendAction = (e) => {
    let ctl = {
      playerID: this.state.user.playerID,
      pin: this.state.user.pin,
      button: e.button,
      action: e.action,
    };
    
    this.socket.emit('action',JSON.stringify(ctl));
  }

  updatePlayers = (playerList) => {
    var newList = JSON.parse(playerList);
    this.setState({players: newList});
    this.loginUser(); //relogin, since the pin numbers could have changed
  }

  updateGame = (gameState) => {
    var newGame = JSON.parse(gameState);
    this.setState({game: newGame});
    this.loginUser();
  }

  rcvMessage = (data) => {
    console.log('received this from the server:', data);
  }

  render() {

    if(this.state.loggedIn){
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
            <Controller user={this.state.user} game={this.state.game} sendAction = {this.sendAction} />
          </Container>
        </div>
      );  
    }else{
      if(this.state.loginError!="") {
        //show toast
            console.log('Showing toast');
      }

      return (
        <div className="App">
          <Toast
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
            }} show={this.state.loginError!=""} delay={3000} autohide
            onClose={()=> this.setState({loginError: ""})}>
              <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                <strong className="mr-auto">Login</strong>
              </Toast.Header>
          <Toast.Body>{this.state.loginError}</Toast.Body>
          </Toast>    
          <MPGame game={this.state.game} players={this.state.players} />
          <Login players={this.state.players} updateUser = {this.updateUser} />
        </div>
      );  
    }
  }
}

export default Game;
