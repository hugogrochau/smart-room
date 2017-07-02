import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Controls extends PureComponent {
  static propTypes = {
    onChangePersonsLimit: PropTypes.func.isRequired,
    onChangeTemperatureThreshold: PropTypes.func.isRequired
  }

  render() {
    const { className, onChangePersonsLimit, onChangeTemperatureThreshold } = this.props;
    return (
      <div className={className}>
        <label htmlFor="PersonsLimit">Max number of people</label>
        <input id="PersonsLimit" type="number" onChange={e => onChangePersonsLimit(e.target.value)} />
        <label htmlFor="TemperatureThreshold">Temperature to turn on AC</label>
        <input id="TemperatureThreshold" type="number" onChange={e => onChangeTemperatureThreshold(e.target.value)} />
      </div>
    );
  }
}
