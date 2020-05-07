import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import {Button, InputGroup, FormControl} from 'react-bootstrap';

export class MPPlayer extends Component {
    constructor(props){
        super(props);
        this.state = {
            pin: ''
        };
    }

    handleChange = (event) => {
        this.setState({pin: event.target.value});
      }
    

    loginPlayer = (e) => {
        console.log('loginPlayer called:', e.target.id, ' pin ', this.state.pin);
        //fetch('/api/autolaunch/player/:playerID');
        console.log(this);
      }

    render() {
        console.log("props from MPPlayer:", this.props);
        
        return(
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Logged In</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.players.map((player)=>{
                       let loginButton;
                       if(player.signedIn){
                         loginButton = 'Logged In';
                       } else {
                         loginButton = (
                            <InputGroup>
                            <FormControl
                              placeholder="Pin #"
                              aria-label="Pin #"
                              aria-describedby="Pin #"
                              value={this.state.value} 
                              onChange={this.handleChange}
                            />
                            <InputGroup.Append>
                              <Button variant="outline-secondary" onClick={this.loginPlayer} id={player.id}>Button</Button>
                            </InputGroup.Append>
                          </InputGroup>
                         );
                       }

                       return <tr>
                            <td>{ player.id }</td>
                            <td>{ player.name }</td>
                            <td>{loginButton}</td>
                        </tr>
                    })}
                </tbody>
            </Table>
        )
        
    }
}

export default MPPlayer
