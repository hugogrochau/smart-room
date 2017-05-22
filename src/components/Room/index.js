import React, { Component } from 'react';
import PropTypes from 'prop-types';
import simpleheat from 'simpleheat';
import Sensor from '../Sensor';

import positionMap from './positionMap';
import roomImage from './L458.png';
import './Room.css';

class Room extends Component {
  static propTypes = {
    sensors: PropTypes.arrayOf(PropTypes.shape({ 
      id: PropTypes.number.isRequired,
      temperature: PropTypes.number.isRequired
     }))
  }

  sensorStyleByPosition = (position) => {
    const margins = positionMap[position];
    return {
      marginLeft: `${margins.left}px`,
      marginTop: `${margins.top}px`
    };
  }

  drawHeatMap = () => {
    this.heatMap.clear();
    this.props.sensors.forEach(sensor => {
      const positions = positionMap[sensor.position];
      this.heatMap.add([(positions.left + 320) / 1.9, (positions.top + 400) / 5, sensor.temperature]);
    });
    this.heatMap.radius(30, 100);
    this.heatMap.draw();
  }

  componentDidMount() {
    this.heatMap = simpleheat(this.canvas);
    this.drawHeatMap();
  }

  componentDidUpdate() {
    this.drawHeatMap();
  }
  
  
  render() {
    const { sensors } = this.props;

    return (
      <div className="Room" style={{backgroundImage: `url(${roomImage})`}}>
        <canvas ref={(canvas) => this.canvas = canvas} className="HeatMap" />
        {sensors.map(sensor => 
          <Sensor { ...sensor } { ...this.sensorStyleByPosition(sensor.position) }  key={sensor.id} />
        )}
      </div>
    );
  }
}

export default Room;