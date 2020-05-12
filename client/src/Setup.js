import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
import {Row, Col, Container, Button, InputGroup} from 'react-bootstrap'
import React, { Component } from 'react';
import WSocket from './components/WSocket';

import './Game.css';


class Setup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        name: 'No Game',
        numberOfPlayers: 0,
        playerUp: '',
        playerName: '',
        ballInPlay: 0,
        gameOver: false
        },
      players: [
        {
          name: "Joe",
          id: "1",
          connected: false,
          pin: "1234",
        },
        {
          name: "Jane",
          id: "2",
          connected: false,
          pin: "2345",
        }
      ]
        
    }
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

    this.connectSocket();

  }


  connectSocket = () => {
      // establish websocket connection to backend server.
      //let ws = new WebSocket('ws://localhost:5000/api/socket');
      let ws = new WebSocket('ws://' + window.location.host + '/api/socket');

      // create and assign a socket to a variable.
      let socket = this.socket = new WSocket(ws);

      /* EVENT LISTENERS */
      socket.on('players', this.updatePlayers);
      socket.on('gamestate', this.updateGame);
  }

  updatePlayers = (playerList) => {
    var newList = JSON.parse(playerList);
    this.setState({players: newList});
  }

  updateGame = (gameState) => {
    var newGame = JSON.parse(gameState);
    this.setState({game: newGame});
  }
  
  handleChange = (e)=> {
    this.setState({game: e.jsObject});
  }

  playerChange = (e)=> {
    this.setState({players: e.jsObject});
  }

  submitGame = (e)=> {
    this.socket.emit('updateGame',JSON.stringify(this.state.game));
  }

  submitPlayer = (e)=> {
    this.socket.emit('updatePlayers',JSON.stringify(this.state.players));
  }

  setPlayer = (e)=> {
    var updated = {...this.state.game}
    updated.playerUp = e.target.value;
    this.setState({game: updated});
  }

  setBall = (e)=> {
    var updated = {...this.state.game}
    updated.ballInPlay = e.target.value;
    updated.gameOver=(e.target.value==="0");

    if(e.target.value==="0"){
      //only if changing to gameover, override the playerup to 0 as well
      updated.playerUp = "0";  
    }


    this.setState({game: updated});
  }


  render() {
      let options = this.state.players.map((player)=>
      <option key={player.id} value={player.id}>{player.id} - {player.name}</option>
      );
//      options.unshift(<option key={-1} value={-1}>{' '}</option>);

      let selPlayerUp = (
        <div>
              <InputGroup>
                <InputGroup.Prepend>
                  <select value={this.state.user} onChange={this.setPlayer}>
                      {options}
                      <option key="0" value="0">Game Over</option>
                  </select>
                  <select id="123" value={this.state.user} onChange={this.setBall}>
                      <option key="1" value="1">Ball 1</option>
                      <option key="2" value="2">Ball 2</option>
                      <option key="3" value="3">Ball 3</option>
                      <option key="0" value="0">Game Over</option>
                  </select>
                </InputGroup.Prepend>
                <InputGroup.Append>
                  <Button variant="outline-secondary" onClick={this.submitGame}>Update</Button>
                </InputGroup.Append>
              </InputGroup>
          
        </div>
      )

    return (
      <Container>
        <button onClick={this.connectSocket}>Connect</button>
        <Row>
          <Col><h3>Game Info</h3>
          <JSONInput
              id          = 'gameid'
              placeholder = { this.state.game }
            // colors      = { darktheme }
              locale      = { locale }
              height      = '200px'
              width = '300px'
              onChange={this.handleChange}
          />
          <Button onClick={this.submitGame}>Update Game</Button>
          </Col>
          <Col>
          <h3>Player Info</h3>
          <JSONInput
              id          = 'playerid'
              placeholder = { this.state.players }
            // colors      = { darktheme }
              locale      = { locale }
              height      = '400px'
              width = '300px'
              onChange={this.playerChange}
          />
          <Button onClick={this.submitPlayer}>Update Player</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {selPlayerUp}
          </Col>
        </Row>
      </Container>
    );
  }
}


export default Setup;
