import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Col, Row, ListGroup, ListGroupItem } from 'reactstrap';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  constructor(props, context) {
    super(props, context);

    //this.handleShow = this.handleShow.bind(this);
    //this.handleClose = this.handleClose.bind(this);

    this.state = {
      searchText: '',
      searchResult: [],
      contactList: [],
      show: false,
    }
   // this.handleSearch = this.handleSearch.bind(this);
   // this.returnContactList = this.returnContactList.bind(this);
  }

  /* ContactList Logic*/
/*
  handleSearch(searchText) {
    this.setState({ searchResult: [], searchText: searchText });
    this.state.contactList.map(contact => {
      if (searchContact(contact, searchText)) {
        this.setState(prevState => ({
          searchResult: [...prevState.searchResult, contact]
        }))
      }
    })
  }
*/


  returnContactList() {
    return this.state.searchText ? this.state.searchResult : this.state.contactList
  }

  /* UI Logic */

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }


  /*
    handleOpen(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      open: true,
      anchorEl: findDOMNode(this.button.current)
    });
  };*/


  flipperDown(e){
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
  flipperUp(e){
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
  handlePlunge(){
    console.log('Plunge Called');
    fetch('/api/autolaunch/player/:playerID');
  }

  render() {
    return (
      
<Container>
<Form>
  <Form.Group as={Row} controlId="formHorizontalEmail">
  <Form.Label>
  MatchPlay Player
  </Form.Label>
  </Form.Group>

  <fieldset>
    <Form.Group as={Row}>
      <Form.Label as="legend" column sm={2}>
        Players
      </Form.Label>
      <Col sm={10}>
        <Form.Check
          type="radio"
          label="Corey"
          name="formHorizontalRadios"
          id="1"
        />
        <Form.Check
          type="radio"
          label="Joe"
          name="formHorizontalRadios"
          id="2"
        />
        <Form.Check
          type="radio"
          label="Matt"
          name="formHorizontalRadios"
          id="3"
        />
      </Col>
    </Form.Group>
  </fieldset>


  <Form.Group as={Row} controlId="formHorizontalEmail">

    <Form.Label column sm={2}>
      Pin
    </Form.Label>
    <Col sm={2}>
      <Form.Control type="pin" placeholder="Pin Number" />
    </Col>
  </Form.Group>
  <Form.Group as={Row}>
    <Col sm={{ span: 10, offset: 2 }}>
      <Button type="submit">Sign in</Button>
    </Col>
  </Form.Group>
</Form>

  <Row>
    <Col><Button variant="primary" style={{ height: 100, width: 100, marginTop: 10 }} className="float-right"  onClick={this.handlePlunge}>
      Launch
    </Button></Col>
  </Row>
  <Row xs={2} md={4} lg={6}>
  <Col><br></br></Col>
  </Row>
  <Row xs={2} md={4} lg={6}>
  <Col><br></br></Col>
  </Row>

  <Row>
    <Col><Button className="small" variant="primary" value="2" onTouchStart={this.flipperDown.bind(this)} onMouseDown={this.flipperDown.bind(this)}  onMouseUp={this.flipperUp.bind(this)} onMouseOut={this.flipperUp.bind(this)} onTouchEnd={this.flipperUp.bind(this)} >
      Top L
    </Button></Col>
    <Col><Button variant="primary" style={{ height: 100, width: 100, marginTop: 10 }} value="3" className="float-right" onTouchStart={this.flipperDown.bind(this)} onMouseDown={this.flipperDown.bind(this)}  onMouseUp={this.flipperUp.bind(this)} onMouseOut={this.flipperUp.bind(this)} onTouchEnd={this.flipperUp.bind(this)} >
      Top R
    </Button></Col>
  </Row>
  <Row>
  <Col><br></br></Col>
  </Row>
  <Row>
  <Col><br></br></Col>
  </Row>
  <Row>
  <Col><br></br></Col>
  </Row>
  <Row>
    <Col><Button variant="primary" style={{ height: 100, width: 100, marginTop: 10 }} value="0" onTouchStart={this.flipperDown.bind(this)} onMouseDown={this.flipperDown.bind(this)}  onMouseUp={this.flipperUp.bind(this)} onMouseOut={this.flipperUp.bind(this)} onTouchEnd={this.flipperUp.bind(this)} >
      Left
    </Button></Col>
    <Col><Button variant="primary" style={{ height: 100, width: 100, marginTop: 10 }} value="1" className="float-right" onTouchStart={this.flipperDown.bind(this)} onMouseDown={this.flipperDown.bind(this)}  onMouseUp={this.flipperUp.bind(this)} onMouseOut={this.flipperUp.bind(this)} onTouchEnd={this.flipperUp.bind(this)} >
      Right
    </Button></Col>

  </Row>
</Container>
        
      );
  }
}


export default App;

/*
<div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>*/
