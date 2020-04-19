import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';

export class Controller extends Component {

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
    

    render() {
        return (
            <div>
                <Button variant="primary" style={{ height: 100, width: 100, marginTop: 10 }} className="float-right"  onClick={this.handlePlunge}>
                Launch
                </Button>

                <Button variant="primary" value="2" onTouchStart={this.flipperDown} onMouseDown={this.flipperDown}  onMouseUp={this.flipperUp} onMouseOut={this.flipperUp} onTouchEnd={this.flipperUp} >
                Top L
                </Button>
                <Button variant="primary"  value="3" className="float-right" onTouchStart={this.flipperDown} onMouseDown={this.flipperDown}  onMouseUp={this.flipperUp} onMouseOut={this.flipperUp} onTouchEnd={this.flipperUp} >
                Top R
                </Button>
                <Button variant="primary" style={{ height: 100, width: 100, marginTop: 10 }} value="0" onTouchStart={this.flipperDown} onMouseDown={this.flipperDown}  onMouseUp={this.flipperUp} onMouseOut={this.flipperUp} onTouchEnd={this.flipperUp} >
                Left
                </Button>
                <Button variant="primary" style={{ height: 100, width: 100, marginTop: 10 }} value="1" className="float-right" onTouchStart={this.flipperDown} onMouseDown={this.flipperDown}  onMouseUp={this.flipperUp} onMouseOut={this.flipperUp} onTouchEnd={this.flipperUp} >
                Right
                </Button>
            </div>
        )
    }
}

export default Controller
