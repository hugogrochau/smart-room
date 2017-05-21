import React, { Component } from 'react';
import mqtt from 'mqtt';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
  }

  componentDidMount() {
    const client = mqtt.connect('mqtt://test.mosca.io');
    client.on('connect', () => {
      client.subscribe('hugogrochau/smart-home');
    });

    client.on('message', (topic, message) => {
      this.setState({ message: message.toString() });
    });
  }
  
  render() {
    const { message } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{message}</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
