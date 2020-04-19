import React, { Component } from 'react'

export class MPPlayer extends Component {
    render() {
        return this.props.players.map((player)=>(
                <h3>{ player.name }</h3>
        ));
        
    }
}

export default MPPlayer
