import React, { Component } from 'react';
import mqtt from 'mqtt';
import { BASE_TOPIC, METHOD_REGEX } from '../../constants';

import Room from '../Room';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showHeatMap: false,
      sensors: [],
    };
  }

  publishMessage = (method, message) => {
    console.log(`[Sent] Method: ${method} | Message: ${message}`);
    this.client.publish(`${BASE_TOPIC}/${method}`, message);
  }

  updateSensors = (sensors, sensor) => {
    let isNewSensor = true;

    const updatedSensors = sensors.map((s) => {
      if (s.id === sensor.id) {
        isNewSensor = false;
        return sensor;
      }
      return s;
    });

    if (isNewSensor) {
      updatedSensors.push(sensor);
    }

    return updatedSensors;
  }

  handleMessage = (topic, message) => {
    // match method
    const method = topic.match(METHOD_REGEX)[1];
    const parsedMessage = JSON.parse(message);
    const { id } = parsedMessage;
    console.log(`[Received] Method: ${method} | Message:`, parsedMessage);

    switch (method) {
      // receive update from a sensor
      case 'update':
        const updatedSensors = this.updateSensors(this.state.sensors, parsedMessage);
        this.setState({ sensors: updatedSensors });
        break;
      // a new sensor requests to be registered
      case 'requestRegistration':
        this.publishMessage('acceptRegistration', id);
        break;
      default:
    }
  }

  handleShowHeatMapChange = (event) => {
    this.setState({showHeatMap: !this.state.showHeatMap});
  }

  componentDidMount() {
    this.client = mqtt.connect('mqtt://test.mosca.io');
    this.client.on('connect', () => {
      this.client.subscribe(`${BASE_TOPIC}/update`);
      this.client.subscribe(`${BASE_TOPIC}/requestRegistration`);
    });

    this.client.on('message', this.handleMessage);
  }
  
  render() {
    const { sensors, showHeatMap } = this.state;
    return (
      <div className="App">
        <div className="Controls">
          <label htmlFor="ShowHeatMap">Show heatmap</label>
          <input id="ShowHeatMap" type="checkbox" onChange={this.handleShowHeatMapChange} />
        </div>
        <Room sensors={sensors} showHeatMap={showHeatMap} publishMessage={this.publishMessage}/>
      </div>
    );
  }
}
