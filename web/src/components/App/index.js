import React, { Component } from 'react';
import mqtt from 'mqtt';

import FaArrowRight from 'react-icons/lib/fa/arrow-right';
import FaArrowLeft from 'react-icons/lib/fa/arrow-left';

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
      personAnimation: false
    };
  }

  publishMessage = (method, message) => {
    console.log(`[Sent] Method: ${method} | Message: ${message}`);
    this.client.publish(`${BASE_TOPIC}/${method}`, message);
  }

  onUpdate = (_, message) => {
    const roomData = JSON.parse(message);
    const { temperature, persons } = roomData;
    const { roomData: { persons: prevPersons }, settings: { temperatureThreshold } } = this.state;
    let acOn = this.state.acOn;
    let personAnimation = false;

    if (temperature > temperatureThreshold && !acOn) {
      this.publishMessage('ac', 'on');
      acOn = true;
    } else if (temperature < temperatureThreshold && acOn)  {
      this.publishMessage('ac', 'off');
      acOn = false;
    }

    if (persons > prevPersons) {
      personAnimation = 'enter';
    } else if (persons < prevPersons) {
      personAnimation = 'leave';
    }

    if (personAnimation) {
      setTimeout(() => {
        this.setState({ personAnimation: false });
      }, 2000);
    }

    this.setState({ roomData, acOn, personAnimation });
  }

  onChangePersonsLimit = (personsLimit) => {
    personsLimit = parseInt(personsLimit, 10);
    this.setState({ settings: { ...this.state.settings, personsLimit }});
  }

  onChangeTemperatureThreshold = (temperatureThreshold) => {
    temperatureThreshold = parseFloat(temperatureThreshold);
    this.setState({ settings: { ...this.state.settings, temperatureThreshold }});
  }

  componentDidMount() {
    this.client = mqtt.connect('mqtt://test.mosca.io');
    this.client.on('connect', () => {
      this.client.subscribe(`${BASE_TOPIC}/update`);
    });
    this.client.on('message', this.onUpdate);
  }

  render() {
    const { roomData, settings, acOn, personAnimation } = this.state;

    return (
      <div className="App">
        <Room acOn={acOn} { ...roomData } { ...settings }/>
        <Controls onChangePersonsLimit={this.onChangePersonsLimit} onChangeTemperatureThreshold={this.onChangeTemperatureThreshold} { ...settings } className="Controls" />
        {personAnimation &&
          <div className={`PersonAnimation-${personAnimation}`}>{personAnimation === 'enter' ? <FaArrowLeft /> : <FaArrowRight />}</div>
        }
      </div>
    );
  }
}
