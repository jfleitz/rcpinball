import React, { Component } from 'react'
import MPPlayer from './MPPlayer';
import { Container, Row, Col } from 'react-bootstrap';

export class MPGame extends Component {
    render() {
        if(this.props.game.gameOver) {
            return (
                <div>
                    <h3>Game Over</h3>
                    <h2>Players:</h2>
                    <MPPlayer players={this.props.players} game={this.props.game}/>
                </div>
            )
        }else {
            return (
                <Container>
                <Row>
                <Col>
                <h3>{this.props.game.name}</h3>
                </Col>
                </Row>
                <Row>
                    <Col>
                    Ball In Play: {this.props.game.ballInPlay}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <MPPlayer players={this.props.players} game={this.props.game}/>
                    </Col>
                </Row>
                </Container>
            )
           
        }
    }
}

export default MPGame
