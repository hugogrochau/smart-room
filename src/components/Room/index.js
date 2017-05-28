import React, { Component } from 'react';
import PropTypes from 'prop-types';
import simpleheat from 'simpleheat';
import Sensor from '../Sensor';

import positionMap from './positionMap';
import roomImage from './L458.png';
import './Room.css';

export default class Room extends Component {
  static propTypes = {
    showHeatMap: PropTypes.bool,
    sensors: PropTypes.arrayOf(PropTypes.shape({ 
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      temperature: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
     })).isRequired,
    publishMessage: PropTypes.func.isRequired
  }

  sensorStyleByPosition = (position) => {
    const margins = positionMap[position];
    return {
      marginLeft: `${margins.left}px`,
      marginTop: `${margins.top}px`
    };
  }

  drawHeatMap = () => {
    const { sensors } = this.props;
    const { _width: heatmapWidth, _height: heatmapHeight } = this.heatMap;
    const { width: canvasWidth, height: canvasHeight } = this.canvas.getBoundingClientRect();
    const sensorWidth = 70;
    const sensorHeight = 70;
    const widthRatio = heatmapWidth / canvasWidth;
    const heightRatio = heatmapHeight / canvasHeight;
    this.heatMap.clear();

    sensors.forEach(sensor => {
      const positions = positionMap[sensor.position];
      const x = (positions.left + canvasWidth / 2 + sensorWidth / 2) * widthRatio;
      const y = (positions.top + canvasHeight / 2 + sensorHeight / 2) * heightRatio;
      this.heatMap.add([x, y, sensor.temperature]);
    });

    this.heatMap.radius(150, 350);
    this.heatMap.draw();
  }

  componentDidMount() {
    const { showHeatMap } = this.props;
    this.heatMap = simpleheat(this.canvas);
    if (showHeatMap) {
      this.drawHeatMap();
    }
  }

  componentDidUpdate() {
    const { showHeatMap } = this.props;
    if (showHeatMap) {
      this.drawHeatMap();
    } else {
      this.heatMap.clear();
      this.heatMap.draw();
    }
  }
  
  
  render() {
    const { sensors, publishMessage } = this.props;

    return (
      <div className="Room" style={{backgroundImage: `url(${roomImage})`}}>
        <canvas ref={(canvas) => this.canvas = canvas} className="HeatMap" />
        {sensors.map(sensor => 
          <Sensor { ...sensor } { ...this.sensorStyleByPosition(sensor.position) } publishMessage={publishMessage} key={sensor.id} />
        )}
      </div>
    );
  }
}
