import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import styles from './controller.module.css';

export class Controller extends Component {
  constructor(props){
    super(props);
    
    this.state={
      playerID: this.props.user.playerID,
      pin: this.props.user.pin,
      playerUp: this.props.game.playerUp,
      gameOver: this.props.game.gameOver
    }
  }

    flipperDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        var url='/api/button/' + e.target.value + '/action/1/player/1';
    
        console.log('Flipper pressed, calling ',url);
    
        ///game/:gameID/player/:playerID/action/:actionID
        fetch(url);
      /*.then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
    */
    
      }
      flipperUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        var url='/api/button/' + e.target.value + '/action/0/player/1';
    
        console.log('Flipper pressed, calling ',url);
    
        ///game/:gameID/player/:playerID/action/:actionID
        fetch(url);
      /*.then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });*/
    
    
      }
      handlePlunge = () => {
        console.log('Plunge Called');
        fetch('/api/autolaunch/player/:playerID');
      }

      checkUser() {
        let ret = false;

        if (this.props.user.playerID !== this.props.game.playerUp) {
          console.log("player is not up: ", this.props.user.playerID, this.props.game.playerUp);
          ret = true;
        }
        if (this.state.gameOver) {
          console.log("game is over");
          ret = true;
        }
        return ret;
      }

      //style={{ height: 100, width: 100, marginTop: 10 }}
    render() {
        let ret = this.checkUser();
        if(ret){
          return (
            <div className="Controller">
              Waiting for your turn
            </div>
          )
        }

        return (
            <div className="Controller">
              <Row>
                <Col>
                <Button className={styles.btnlaunch} variant="primary" disabled={ret}  onClick={this.handlePlunge}>
                Launch
                </Button>
                </Col>
              </Row>

              <Row>
                <Col>
                <div  className={styles.padrow} ><p> </p> </div>
                </Col>
              </Row>
              <Row>
                <Col>
                <div  className={styles.padrow} ><p></p> </div>
                </Col>
              </Row>

              <div class="styles.spacer5"></div>
              <Row>
                <Col>
                <Button className={styles.btnflippers} variant="primary" disabled={ret} value="0" onTouchStart={this.flipperDown} onMouseDown={this.flipperDown}  onMouseUp={this.flipperUp} onMouseOut={this.flipperUp} onTouchEnd={this.flipperUp} block>
                              Left
                              </Button>

                </Col>
                <Col>
                <Button variant="primary" className={styles.btnflippers} disabled={ret} value="1"  onTouchStart={this.flipperDown} onMouseDown={this.flipperDown}  onMouseUp={this.flipperUp} onMouseOut={this.flipperUp} onTouchEnd={this.flipperUp} block>
                              Right
                              </Button>
                </Col>
              </Row>
            </div>
        )
    }
}

export default Controller
