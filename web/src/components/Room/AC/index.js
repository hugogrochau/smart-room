import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class AC extends PureComponent {
  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    status: PropTypes.bool.isRequired
  };

  render() {

    const { onToggle, status, className } = this.props;
    return (
      <div className={className} >
        <div className={`ACStatus-${status ? 'on' :'off'}`} />
        <button className="ACButton" onClick={onToggle} />
      </div>
    );
  }
}