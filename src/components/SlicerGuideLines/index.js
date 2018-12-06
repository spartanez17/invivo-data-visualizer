import React, { Component } from "react";
import PropTypes from "prop-types";

import stockStyles from "./styles.css";

export default class SlicerGuideLines extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    const { cross, thickness, colors } = this.props;
    this.drawСross(cross, thickness, colors);
  }

  drawColorLine(context, from, to, thickness, color) {
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.lineWidth = thickness;
    context.strokeStyle = color;
    context.stroke();
  }

  drawСross(cross, thickness, colors) {
    let context = this.canvas.current.getContext("2d");
    let { x, y } = cross;
    let { width, height } = this.props.size;
    context.clearRect(0, 0, width, height);
    let { v, h } = colors;
    this.drawColorLine(context, { x, y: 0 }, { x, y: height }, thickness, v);
    this.drawColorLine(context, { x: 0, y }, { x: width, y }, thickness, h);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { cross, thickness, colors } = nextProps;
    this.drawСross(cross, thickness, colors);
    return true;
  }

  render() {
    return (
      <canvas
        ref={this.canvas}
        width={this.props.size.width}
        height={this.props.size.height}
        className={`${stockStyles["slicer-guide-lines"]} ${
          this.props.className
        }`}
        style={{ zIndex: this.props.zIndex }}
      />
    );
  }
}

SlicerGuideLines.defaultProps = {
  className: ""
};

SlicerGuideLines.propTypes = {
  className: PropTypes.string.isRequired,
  zIndex: PropTypes.number,
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  cross: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired,
  thickness: PropTypes.number.isRequired,
  colors: PropTypes.shape({
    v: PropTypes.string.isRequired,
    h: PropTypes.string.isRequired
  })
};
