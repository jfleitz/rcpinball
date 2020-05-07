import React, { Component } from 'react'
import Match from '../components/Match'
import Controller from '../components/Controller'

export class PlayerControl extends Component {
    render() {
        return (
            <div>
                <Match game={this.props.game} players={this.props.players} />
                <Controller user={this.props.user} playerUp={this.state.props.playerUp}/>
            </div>
        )
    }
}

export default PlayerControl
