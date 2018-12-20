import React from "react";
import PropTypes from "prop-types";

import stockStyles from "./styles.css";

const ImageLayer = ({ className, alt, src, size, zIndex }) => (
  <img
    className={`${stockStyles["image"]} ${className}`}
    alt={alt}
    src={src}
    style={{ ...size, zIndex }}
  />
);

ImageLayer.defaultProps = {
  className: "",
  alt: "",
  src: "",
  size: {
    width: 60,
    height: 160
  }
};

ImageLayer.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  src: PropTypes.string.isRequired,
  zIndex: PropTypes.number,
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  })
};

export default ImageLayer;
