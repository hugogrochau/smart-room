import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Controls extends PureComponent {
  static propTypes = {
    personsLimit: PropTypes.number.isRequired,
    temperatureThreshold: PropTypes.number.isRequired,
    onChangePersonsLimit: PropTypes.func.isRequired,
    onChangeTemperatureThreshold: PropTypes.func.isRequired
  }

  render() {
    const { className, personsLimit, temperatureThreshold, onChangePersonsLimit, onChangeTemperatureThreshold } = this.props;
    return (
      <div className={className}>
        <label htmlFor="PersonsLimit">Max number of people</label>
        <input id="PersonsLimit" type="number" value={personsLimit} onChange={e => onChangePersonsLimit(e.target.value)} />
        <label htmlFor="TemperatureThreshold">Temperature to turn on AC</label>
        <input id="TemperatureThreshold" type="number" value={temperatureThreshold} onChange={e => onChangeTemperatureThreshold(e.target.value)} />
      </div>
    );
  }
}
