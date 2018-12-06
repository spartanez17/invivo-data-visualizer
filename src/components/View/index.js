import React, { Component } from "react";
import PropTypes from "prop-types";
import { transposedCoord, getProjectedPoint } from "../../utils";
import { supposedDataSizes } from "../../constants";

import stockStyles from "./styles.css";

const { DATA_WIDTH, DATA_HEIGHT } = supposedDataSizes;
export default class View extends Component {
  provideArguments = event => {
    let { x, y } = event.target.getBoundingClientRect();
    let elemCoords = {
      x: Math.ceil(event.clientX - x),
      y: Math.ceil(event.clientY - y)
    };
    let transpCoords = transposedCoord(
      elemCoords.x,
      elemCoords.y,
      this.props.size.height
    );
    let displayCoodrs = {
      x: transpCoords.xTransp,
      y: transpCoords.yTransp
    };
    let projCoords = getProjectedPoint(
      displayCoodrs,
      this.props.dataSize,
      this.props.size
    );
    let dataCoords = {
      x: projCoords.xCoef,
      y: projCoords.yCoef
    };
    this.props.onClick(elemCoords, dataCoords);
  };

  handleWheel = event => {
    if (this.props.onWheel) {
      event.preventDefault();
      this.props.onWheel(event);
    }
  };

  render() {
    let {
      size,
      className,
      size: { width, height },
      styles,
      children
    } = this.props;
    return (
      <div
        role="presentation"
        className={`${stockStyles["view-layer"]} ${className}`}
        onClick={this.provideArguments}
        onWheel={this.handleWheel}
        style={{ ...styles, width, height }}
      >
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            zIndex: 100 - index,
            size
          });
        })}
      </div>
    );
  }
}

View.defaultProps = {
  className: "",
  onClick: function(displayCoords, dataCoords) {},
  dataSize: {
    width: DATA_WIDTH,
    height: DATA_HEIGHT
  }
};

View.propTypes = {
  className: PropTypes.string.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  onWheel: PropTypes.func,
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  dataSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired
};
