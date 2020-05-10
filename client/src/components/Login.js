import React, { Component } from 'react'
import {Button, InputGroup, FormControl} from 'react-bootstrap';

//players={this.props.players}
export class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            pin: '',
            user: '-1'
        };
    }


    handleChange = (event) => {
        this.setState({pin: event.target.value});
      }

    handleUser = (event) => {
        this.setState({user: event.target.value});
    }

    userInfo =() => {
         return( {
             user: this.state.user,
             pin: this.state.pin
         })
     }


    render() {
        let players = this.props.players;
        let availPlayers = players.filter(function(player) {
            return player.connected === false;
        })

        //allowing to reuse if page closed and reloaded
        availPlayers = players;

        let options = availPlayers.map((player)=>
        <option key={player.id} value={player.id}>{player.name}</option>
        );
        options.unshift(<option key={-1} value={-1}>{' '}</option>);
        var updateUser = this.props.updateUser;

        if (availPlayers.length !== 0) {
            return (<div>
                Login: {' '} 
                <InputGroup>
                <InputGroup.Prepend><select value={this.state.user} onChange={this.handleUser}>
                    {options}
                </select></InputGroup.Prepend>
                            <FormControl
                              placeholder="Pin #"
                              aria-label="Pin #"
                              aria-describedby="Pin #"
                              value={this.state.value} 
                              onChange={this.handleChange}
                              style={{width: '20% !important'}}
                            />
                            <Button variant="outline-secondary" onClick={() => updateUser({user: this.state.user, pin: this.state.pin})}>Button</Button>
                          </InputGroup>
            </div>)

        }

        return (
            <div></div>
        )
    }
}

export default Login
