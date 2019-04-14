import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Game from './pages/Game'
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact={true} component={Game} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
