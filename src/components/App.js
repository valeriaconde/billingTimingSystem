import React, { Component } from 'react';
import '../styles/App.css';
import Menu from './Menu';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import Clientes from './Clientes';
import NotFoundPage from './NotFoundPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = [];
  }

  componentDidMount(){
    document.title = "Legem";
  }

  render(){
    return(
      <BrowserRouter>
        <Menu />
          <Switch>
            <Route path="/" exact component={Clientes} />

            <Route path="/home" exact component={Clientes} />

            <Route component={NotFoundPage} />
          </Switch>
      </BrowserRouter>
    );
  }
}

export default App;