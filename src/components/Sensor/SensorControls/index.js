import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import './SensorControls.css';

export default class SensorControls extends PureComponent {
  static propTypes = {
    changeLedStatus: PropTypes.func.isRequired
  }

  render() {
    const { changeLedStatus } = this.props;

    return (
      <div className="SensorControls">
        <div>
          <label htmlFor="led1">Led 1 status</label>
          <input id="led1" type="checkbox" onChange={() => changeLedStatus(1)}/>
        </div>
        <div>
          <label htmlFor="led2">Led 2 status</label>
          <input id="led2" type="checkbox" onChange={() => changeLedStatus(2)}/>
        </div>
      </div>
    );
  }
}
