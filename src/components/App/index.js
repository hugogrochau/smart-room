import React, { Component } from 'react';
import mqtt from 'mqtt';
import { BASE_TOPIC, METHOD_REGEX } from '../../constants';

import Room from '../Room';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showHeatMap: false,
      sensors: [
        { temperature: 20, position: 14, key: 14 },
        { temperature: 40, position: 15, key: 15 },
      ],
    };
  }

  publishMessage = (client, method, message) => {
    console.log(`[Sent] Method: ${method} | Message: ${message}`);
    client.publish(`${BASE_TOPIC}/${method}`, message);
  }

  handleMessage = (client) => (topic, message) => {
    // match method
    const method = topic.match(METHOD_REGEX)[1];
    const parsedMessage = JSON.parse(message);
    const { key } = parsedMessage;
    console.log(`[Received] Method: ${method} | Message:`, parsedMessage);

    switch (method) {
      // receive update from a sensor
      case 'update':
        const sensors = this.state.sensors.slice();
        sensors[key] = { ...parsedMessage };
        this.setState({ sensors });
        break;
      // a new sensor requests to be registered
      case 'requestRegistration':
        this.publishMessage(client, 'acceptRegistration', key);
        break;
      default:
    }
  }

  handleShowHeatMapChange = (event) => {
    this.setState({showHeatMap: !this.state.showHeatMap});
  }

  componentDidMount() {
    const client = mqtt.connect('mqtt://test.mosca.io');
    client.on('connect', () => {
      client.subscribe(`${BASE_TOPIC}/update`);
      client.subscribe(`${BASE_TOPIC}/requestRegistration`);
    });

    client.on('message', this.handleMessage(client));
  }
  
  render() {
    const { sensors, showHeatMap } = this.state;
    return (
      <div className="App">
        <div className="Controls">
          <label htmlFor="ShowHeatMap">Show heatmap</label>
          <input id="ShowHeatMap" type="checkbox" onChange={this.handleShowHeatMapChange} />
        </div>
        <Room sensors={sensors} showHeatMap={showHeatMap}/>
      </div>
    );
  }
}

export default App;
