import React, { Component } from 'react'
import MPGame from '../components/MPGame';
import Login from '../components/Login';

export class Home extends Component {
    render() {
        return (
            <div>
                <MPGame game={this.props.game} players={this.props.players} />
                <Login players={this.props.players} updateUser={this.props.UpdateUser} />
            </div>
        )
    }
}

export default Home
