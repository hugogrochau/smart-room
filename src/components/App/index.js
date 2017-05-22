import React, { Component } from 'react';
import mqtt from 'mqtt';
import { BASE_TOPIC, METHOD_REGEX } from '../../constants';

import Room from '../Room';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sensors: [
        { temperature: 34, position: 0, id: 0 },
        { temperature: 32, position: 1, id: 1 }
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
    console.log(`[Received] Method: ${method} | Message:`, parsedMessage);

    switch (method) {
      // receive update from a sensor
      case 'update':
        const { id } = parsedMessage;
        const sensors = this.state.sensors.slice();
        sensors[id] = { ...parsedMessage };
        this.setState({ sensors });
        break;
      // a new sensor requests to be registered
      case 'requestRegistration':
        const { key } = parsedMessage;
        const numberOfSensors = this.state.sensors.length;
        // give its id
        this.publishMessage(client, 'acceptRegistration', `${key} ${numberOfSensors}`);
      break;
      default:
    }
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
    const { sensors } = this.state;
    return (
      <div className="App">
        <Room sensors={sensors} />
      </div>
    );
  }
}

export default App;
