import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Status from './Status';

import roomImage from './room.png';
import './Room.css';

export default class Room extends Component {
  static propTypes = {
    publishMessage: PropTypes.func.isRequired,
    temperature: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    persons: PropTypes.number.isRequired
  }

  render() {
    const { temperature, humidity, persons, publishMessage } = this.props;

    return (
      <div className="Room" style={{backgroundImage: `url(${roomImage})`}}>
        <Status temperature={temperature} humidity={humidity} persons={persons} className="Status" />
      </div>
    );
  }
}
