import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './AC.css';

export default class AC extends PureComponent {
  static propTypes = {
    status: PropTypes.bool.isRequired
  };

  render() {

    const { status, className } = this.props;
    const statusString = status ? 'on' : 'off';

    return (
      <div className={`${className} AC-${statusString}`} />
    );
  }
}