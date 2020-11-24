import logo from './logo.svg';
import React from 'react';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = { captionTop: '', captionBottom: ''};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render () {
    return (
    <div className="App">
      <div className="container">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="top">{this.state.captionTop}</p>
        <p className="bottom">{this.state.captionBottom}</p>
      </div>
      <input name="captionTop" value={this.state.captionTop} placeholder='Enter First Caption' onChange={this.handleChange}></input>
      <input name="captionBottom" value={this.state.captionBottom} placeholder='Enter Second Caption' onChange={this.handleChange}></input>
    </div>)
  }
}

export default App;
