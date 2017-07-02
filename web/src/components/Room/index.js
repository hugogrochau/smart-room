import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Status from './Status';

import roomImage from './room.png';
import './Room.css';

export default class Room extends Component {
  static propTypes = {
    personsLimit: PropTypes.number.isRequired,
    temperatureThreshold: PropTypes.number.isRequired,
    temperature: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    persons: PropTypes.number.isRequired,
    publishMessage: PropTypes.func.isRequired
  }

  render() {
    return (
      <div className="Room" style={{backgroundImage: `url(${roomImage})`}}>
        <Status { ...this.props } className="Status" />
      </div>
    );
  }
}