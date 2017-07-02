import React, { Component } from 'react';
import mqtt from 'mqtt';
import { BASE_TOPIC } from '../../constants';

import Room from '../Room';
import Controls from '../Controls';

import './App.css';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      roomData: {
        temperature: 0,
        humidity: 0,
        persons: 0,
      },
      settings: {
        personsLimit: 10,
        temperatureThreshold: 30,
      },
      acOn: false,
    };
  }

  publishMessage = (method, message) => {
    console.log(`[Sent] Method: ${method} | Message: ${message}`);
    this.client.publish(`${BASE_TOPIC}/${method}`, message);
  }

  onUpdate = (_, message) => {
    const roomData = JSON.parse(message);
    this.setState({ roomData });
  }

  onChangePersonsLimit = (personsLimit) => {
    this.setState({ settings: { personsLimit }});
  }

  onChangeTemperatureThreshold = (temperatureThreshold) => {
    this.setState({ settings: { temperatureThreshold }});
  }

  componentDidMount() {
    this.client = mqtt.connect('mqtt://test.mosca.io');
    this.client.on('connect', () => {
      this.client.subscribe(`${BASE_TOPIC}/update`);
    });
    this.client.on('message', this.onUpdate);
  }

  render() {
    const { roomData, settings } = this.state;

    return (
      <div className="App">
        <Room publishMessage={this.publishMessage} { ...roomData } { ...settings }/>
        <Controls onChangePersonsLimit={this.onChangePersonsLimit} onChangeTemperatureThreshold={this.onChangeTemperatureThreshold} { ...settings } className="Controls" />
      </div>
    );
  }
}