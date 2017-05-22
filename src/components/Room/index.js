import React, { Component } from 'react';
import PropTypes from 'prop-types';

import roomImage from './L458.png';
import './Room.css';

class Room extends Component {
  static propTypes = {
    sensors: PropTypes.arrayOf(PropTypes.shape({ 
      id: PropTypes.number.isRequired,
      temperature: PropTypes.number.isRequired
     }))
  }

  render() {
    const { sensors } = this.props;

    return (
      <div className="Room" style={{backgroundImage: `url(${roomImage})`}}>
        <ul>
          {sensors.map(sensor => 
            <li key={sensor.id}>
              {`${sensor.position}: ${sensor.temperature}`}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Room;