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
        { temperature: 34, position: 0,  id: 0  },
        { temperature: 34, position: 1,  id: 1  },
        { temperature: 34, position: 2,  id: 2  },
        { temperature: 34, position: 3,  id: 3  },
        { temperature: 34, position: 4,  id: 4  },
        { temperature: 34, position: 5,  id: 5  },
        { temperature: 32, position: 6,  id: 6  },
        { temperature: 32, position: 7,  id: 7  },
        { temperature: 34, position: 8,  id: 8  },
        { temperature: 34, position: 9,  id: 9  },
        { temperature: 34, position: 10, id: 10 },
        { temperature: 32, position: 11, id: 11 },
        { temperature: 32, position: 12, id: 12 },
        { temperature: 34, position: 13, id: 13 },
        { temperature: 34, position: 14, id: 14 },
        { temperature: 34, position: 15, id: 15 },
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
