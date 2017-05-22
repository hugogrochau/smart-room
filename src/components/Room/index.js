import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Sensor from '../Sensor';

import positionMap from './positionMap';
import roomImage from './L458.png';
import './Room.css';

class Room extends Component {
  static propTypes = {
    sensors: PropTypes.arrayOf(PropTypes.shape({ 
      id: PropTypes.number.isRequired,
      temperature: PropTypes.number.isRequired
     }))
  }

  sensorStyleByPosition = (position) => {
    const margins = positionMap[position];
    return {
      marginLeft: `${margins.left}px`,
      marginTop: `${margins.top}px`
    };
  }

  render() {
    const { sensors } = this.props;

    return (
      <div className="Room" style={{backgroundImage: `url(${roomImage})`}}>
          {sensors.map(sensor => 
            <Sensor { ...sensor } { ...this.sensorStyleByPosition(sensor.position) }  key={sensor.id} />
          )}
      </div>
    );
  }
}

export default Room;