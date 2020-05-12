import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import styles from './player.module.css';

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
    
    render() {
        return(
            <Table style={{fontSize: "12px" , height: "10px"}}>
                <thead>
                    <tr style={{height: "5px"}}>
                        <th>#</th>
                        <th>Player</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.players.map((player)=>{
                       if(!player.connected){
                            return <tr className={styles.signin}>
                            <td>{ player.id }</td>
                            <td>{ player.name }</td>
                            <td>Sign In</td>
                            </tr>
                            
                       } else {
                           if (this.props.game.playerUp === player.id) {
                                return <tr className={styles.playerup}>
                                <td>{ player.id }</td>
                                <td>{ player.name }</td>
                                <td>Player Up</td>
                                </tr>
                           }
                           else {
                                return <tr className={styles.waiting}>
                                <td>{ player.id }</td>
                                <td>{ player.name }</td>
                                <td>Waiting</td>
                                </tr>
                           }
                         
                       }
                    })}
                </tbody>
            </Table>
        )        
    }
}

export default MPPlayer
