import React, { Component } from 'react';
import PropTypes from 'prop-types';

import roomImage from './room.png';
import './Room.css';

export default class Room extends Component {
  static propTypes = {
    publishMessage: PropTypes.func.isRequired
  }

  render() {
    const { publishMessage } = this.props;

    return (
      <div className="Room" style={{backgroundImage: `url(${roomImage})`}}>
      </div>
    );
  }
}
