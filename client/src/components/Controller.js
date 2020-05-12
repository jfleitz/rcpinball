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
  
      var sendAction = this.props.sendAction;
      sendAction({button: e.target.value , action: "down"});
      
  }
  flipperUp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    var sendAction = this.props.sendAction;
    sendAction({button: e.target.value , action: "up"});        
  }


  handlePlunge = () => {
    console.log('Plunge Called');
    var sendAction = this.props.sendAction;
    sendAction({button:"plunge", action: "down"})        
  }

  checkUser() {
    let ret = false;

    if (this.props.user.playerID !== this.props.game.playerUp) {
      console.log("player is not up: ", this.props.user.playerID, this.props.game.playerUp);
      ret = true;
    }
    if (this.props.game.gameOver) {
      console.log("game is over");
      ret = true;
    }
    return ret;
  }

  render() {
      let ret = this.checkUser();
      var sendAction = this.props.sendAction;

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
