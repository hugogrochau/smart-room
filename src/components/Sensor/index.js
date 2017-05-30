import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SensorControls from './SensorControls';

import sensorImage from './sensor.jpg';
import './Sensor.css';

export default class Sensor extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    temperature: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    marginLeft: PropTypes.string,
    marginTop: PropTypes.string,
    publishMessage: PropTypes.func.isRequired
  }

  changeLedStatus = (led) => {
    const { publishMessage, id } = this.props;
    publishMessage('changeLedStatus', `${id} ${led}`);
  }


  render() {
    const { temperature, marginLeft, marginTop } = this.props;

    return (
      <div className="Sensor" style={{ marginLeft , marginTop, backgroundImage: `url(${sensorImage}` }}>
        <span className="SensorTemperature">
          {Number(temperature).toFixed(2)}
        </span>
        <SensorControls changeLedStatus={this.changeLedStatus} />
      </div>
    );
  }
}
