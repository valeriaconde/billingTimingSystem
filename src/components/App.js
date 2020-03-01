import React, { Component } from 'react';
import '../styles/App.css';
import Menu from './Menu';

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
      <Menu></Menu>
    );
  }
}

export default App;