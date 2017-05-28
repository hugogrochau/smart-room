import React, { Component } from 'react';
import PropTypes from 'prop-types';

import sensorImage from './sensor.jpg';
import './Sensor.css';

class Sensor extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    temperature: PropTypes.number,
    marginLeft: PropTypes.string,
    marginTop: PropTypes.string,
  }

  render() {
    const { temperature, marginLeft, marginTop } = this.props;

    return (
      <div className="Sensor" style={{ marginLeft , marginTop, backgroundImage: `url(${sensorImage}` }}>
        {temperature}
      </div>
    );
  }
}

export default Sensor;