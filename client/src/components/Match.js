import React, { Component } from 'react'
import MPPlayer from './MPPlayer';
import MPGame from './MPGame';

export class Match extends Component {
    render() {
        return (
            <div>
                <h2>Current Game:</h2> <p></p>
                <MPGame game={this.props.game}></MPGame>
                <h2>Players:</h2>
                <MPPlayer players={this.props.players}/>
            </div>
        )
    }
}

export default Match
