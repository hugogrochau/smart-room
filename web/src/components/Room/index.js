import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Status from './Status';
import AC from './AC';

import roomImage from './room.png';
import './Room.css';

export default class Room extends Component {
  static propTypes = {
    personsLimit: PropTypes.number.isRequired,
    temperatureThreshold: PropTypes.number.isRequired,
    temperature: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    persons: PropTypes.number.isRequired,
    acOn: PropTypes.bool.isRequired
  }

  render() {
    const { acOn } = this.props;
    return (
      <div className="Room" style={{backgroundImage: `url(${roomImage})`}}>
        <Status { ...this.props } />
        <AC status={acOn}/>
      </div>
    );
  }
}
