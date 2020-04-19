import React, { Component } from 'react'

export class MPGame extends Component {
    render() {
        return (
            <div>
                <h3>{this.props.game.name}</h3>
                # of Players: {this.props.game.numberOfPlayers}
                <p></p>
                Ball In Play: {this.props.game.ballInPlay}
                <p></p>
                Current Player: {this.props.game.playerName}
            </div>
        )
    }
}

export default MPGame
