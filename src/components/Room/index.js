import React, { Component } from 'react';
import PropTypes from 'prop-types';
import simpleheat from 'simpleheat';
import Sensor from '../Sensor';

import positionMap from './positionMap';
import roomImage from './L458.png';
import './Room.css';

class Room extends Component {
  static propTypes = {
    showHeatMap: PropTypes.bool,
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
    const { showHeatMap, sensors } = this.props;
    const { _width: heatmapWidth, _height: heatmapHeight } = this.heatMap;
    const { width: canvasWidth, height: canvasHeight } = this.canvas.getBoundingClientRect();
    const sensorWidth = 70;
    const sensorHeight = 70;
    const widthRatio = heatmapWidth / canvasWidth;
    const heightRatio = heatmapHeight / canvasHeight;
    this.heatMap.clear();
    if (showHeatMap) {
      sensors.forEach(sensor => {
        const positions = positionMap[sensor.position];
        const x = (positions.left + canvasWidth / 2 + sensorWidth / 2) * widthRatio;
        const y = (positions.top + canvasHeight / 2 + sensorHeight / 2) * heightRatio;
        this.heatMap.add([x, y, sensor.temperature]);
      });
    }
    this.heatMap.radius(30, 60);
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
        <canvas ref={(canvas) => this.canvas = canvas} className="HeatMap" onClick={(e) => console.log(e.clientX)} />
        {sensors.map(sensor => 
          <Sensor { ...sensor } { ...this.sensorStyleByPosition(sensor.position) }  key={sensor.id} />
        )}
      </div>
    );
  }
}

export default Room;