import React, { Component } from "react";
import PropTypes from "prop-types";

import stockStyles from "./styles.css";

export default class PointLayer extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    const { dataArray, size } = this.props;
    this.drawByPoints(dataArray, size);
  }

  drawByPoints(dataArray, size) {
    let context = this.canvas.current.getContext("2d");
    let myImageData = new ImageData(dataArray, size.width, size.height);
    context.putImageData(myImageData, 0, 0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { dataArray, size } = nextProps;
    this.drawByPoints(dataArray, size);
    return true;
  }

  render() {
    let { width, height } = this.props.size;
    return (
      <canvas
        ref={this.canvas}
        width={width}
        height={height}
        className={`${stockStyles["curr-canvas-layer"]} ${
          this.props.className
        }`}
        style={{
          zIndex: this.props.zIndex
        }}
      />
    );
  }
}

PointLayer.defaultProps = {
  className: "",
  size: {
    width: 60,
    height: 160
  }
};

PointLayer.propTypes = {
  className: PropTypes.string.isRequired,
  zIndex: PropTypes.number,
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }).isRequired,
  dataArray: PropTypes.object
};
