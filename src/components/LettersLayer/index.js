import React, { Component } from "react";
import PropTypes from "prop-types";

import stockStyles from "./styles.css";

export default class LettersLayer extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    const { letters, color, fontSize } = this.props;
    this.drawSideLetters(letters, color, fontSize);
  }

  drawSideLetters(letters, color, fontSize) {
    let { width, height } = this.props.size;
    let context = this.canvas.current.getContext("2d");
    context.font = `${fontSize}px Arial`;
    context.fillStyle = color;
    let ltrs = letters.toUpperCase();
    context.fillText(ltrs[0], width / 2 - fontSize / 4, fontSize);
    context.fillText(ltrs[1], width - fontSize, height / 2);
    context.fillText(ltrs[2], width / 2 - fontSize / 4, height - fontSize / 4);
    context.fillText(ltrs[3], 2, height / 2);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <canvas
        ref={this.canvas}
        width={this.props.size.width}
        height={this.props.size.height}
        className={`${stockStyles["letter-layer"]} ${this.props.className}`}
        style={{ zIndex: this.props.zIndex }}
      />
    );
  }
}

LettersLayer.defaultProps = {
  className: "",
  color: "#fff",
  fontSize: 20
};

LettersLayer.propTypes = {
  className: PropTypes.string.isRequired,
  zIndex: PropTypes.number,
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  letters: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired
};
