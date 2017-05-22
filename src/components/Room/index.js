import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
      <div>
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