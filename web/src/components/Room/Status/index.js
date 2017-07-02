import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TiThermometer from 'react-icons/lib/ti/thermometer';
import FaTint from 'react-icons/lib/fa/tint';
import FaUser from 'react-icons/lib/fa/user';

export default class Status extends PureComponent {
  static propTypes = {
    publishMessage: PropTypes.func.isRequired,
    temperature: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    persons: PropTypes.number.isRequired
  }

  render() {
    const { temperature, humidity, persons, className } = this.props;
    return (
      <ul className={className}>
        <li><TiThermometer /> {temperature}</li>
        <li><FaTint /> {humidity} </li>
        <li><FaUser /> {persons} </li>
      </ul>
    );
  }
}
