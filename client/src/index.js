import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Game from './Game';
import Setup from './Setup';

ReactDOM.render(
  <Router>
      <div>
        <Route exact path="/" component={Game}/>
        <Route path="/setup" component={Setup} />
      </div>
  </Router>,
  document.getElementById('root')
)
