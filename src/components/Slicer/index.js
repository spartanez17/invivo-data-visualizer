import React, { Component } from "react";
import PropTypes from "prop-types";
import View from "../View";
import SlicerGuideLines from "../SlicerGuideLines";
import LettersLayer from "../LettersLayer";
import { supposedDataSizes, crossColors } from "../../constants";
import UIntArrayShaper from "../../UIntArrayShaper";

import stockStyles from "./styles.css";

const { DATA_WIDTH, DATA_HEIGHT, DATA_DEPTH } = supposedDataSizes;
const { CORONAL_COLOR, SAGITTAL_COLOR, TRANSVERSE_COLOR } = crossColors;

export default class Slicer extends Component {
  constructor(props) {
    super(props);
    let {
      size: { width, height, depth },
      dataSize: { width: dataW }
    } = this.props;
    this.state = {
      quotient: width / dataW,
      slicerX: width / 2,
      slicerY: height / 2,
      slicerZ: depth / 2
    };
  }

  handleClick = (currDisplayCoords, currDataCoords) => {
    let { slicerX, slicerY, slicerZ, quotient } = this.state;
    let dataCoords = {
      x: Math.floor(slicerX / quotient),
      y: Math.floor(slicerY / quotient),
      z: Math.floor(slicerZ / quotient)
    };
    this.props.onClick({ ...dataCoords, ...currDataCoords });
    this.setState({
      ...currDisplayCoords
    });
  };

  handleClickCoronal = (displayCoords, dataCoords) => {
    let { x: slicerX, y: slicerY } = displayCoords;
    this.handleClick({ slicerX, slicerY }, dataCoords);
  };

  handleClickSagittal = (displayCoords, dataCoords) => {
    let { x: slicerZ, y: slicerY } = displayCoords;
    let { x: z, y } = dataCoords;
    this.handleClick({ slicerY, slicerZ }, { y, z });
  };

  handleClickTransverse = (displayCoords, dataCoords) => {
    let { height, depth } = this.props.size;
    let { slicerY, quotient } = this.state;
    let y = Math.ceil((height - slicerY) / quotient);
    let { x: slicerX, y: slicerZ } = displayCoords;
    let { x, y: z } = dataCoords;
    this.handleClick({ slicerX, slicerZ: depth - slicerZ }, { x, y, z });
  };

  triggerOnClickWithSlice = () => {
    let { slicerX, slicerY, slicerZ, quotient } = this.state;
    this.props.onClick({
      x: Math.floor(slicerX / quotient),
      y: Math.floor((this.props.size.height - slicerY) / quotient),
      z: Math.floor(slicerZ / quotient)
    });
  };

  handleWheel = (slicerCoord, deltaY, topBound) => {
    let key = Object.keys(slicerCoord)[0];
    let coord = Object.assign({}, slicerCoord);
    let buffer = coord[key] + deltaY / 53;
    if (buffer < topBound && buffer >= 0) {
      coord[key] = buffer;
      this.setState({
        ...coord
      });
      this.triggerOnClickWithSlice();
    }
  };

  handleWheelCoronal = event => {
    let { slicerZ } = this.state;
    this.handleWheel({ slicerZ }, event.deltaY, this.props.size.depth);
  };

  handleWheelSagittal = event => {
    let { slicerX } = this.state;
    this.handleWheel({ slicerX }, event.deltaY, this.props.size.width);
  };

  handleWheelTransverse = event => {
    let { slicerY } = this.state;
    this.handleWheel({ slicerY }, event.deltaY, this.props.size.height);
  };

  combineDataArray = () => {
    let {
      size: { width, height, depth },
      dataSize: { width: dataWidth, height: dataHeiht, depth: dataDepth },
      coronal,
      sagittal,
      transverse
    } = this.props;

    let { slicerX, slicerY, slicerZ } = this.state;

    return [
      {
        onWheel: this.handleWheelCoronal,
        onClick: this.handleClickCoronal,
        size: { width, height },
        dataSize: { width: dataWidth, height: dataHeiht },
        layers: coronal,
        slicerScopeProps: {
          cross: { x: slicerX, y: slicerY },
          colors: { v: SAGITTAL_COLOR, h: TRANSVERSE_COLOR }
        },
        letters: "arpl",
        title: "Coronal"
      },
      {
        onWheel: this.handleWheelSagittal,
        onClick: this.handleClickSagittal,
        size: { width: depth, height },
        dataSize: { width: dataDepth, height: dataHeiht },
        layers: sagittal,
        slicerScopeProps: {
          cross: { x: slicerZ, y: slicerY },
          colors: { v: CORONAL_COLOR, h: TRANSVERSE_COLOR }
        },
        letters: "adpv",
        title: "Sagittal"
      },
      {
        onWheel: this.handleWheelTransverse,
        onClick: this.handleClickTransverse,
        size: { width, height: depth },
        dataSize: { width: dataWidth, height: dataDepth },
        layers: transverse,
        slicerScopeProps: {
          cross: { x: slicerX, y: depth - slicerZ },
          colors: { v: SAGITTAL_COLOR, h: CORONAL_COLOR }
        },
        letters: "drvl",
        title: "Transverse"
      }
    ];
  };

  render() {
    const {
      size: { width, height, depth },
      lettersLayer: { fontSize, color }
    } = this.props;
    const style = {
      width: width + depth + 20,
      height: height + depth + 20
    };
    const combiner = this.combineDataArray();

    return (
      <div className={stockStyles["grid-slicer-container"]} style={style}>
        {combiner.map((plane, i) => {
          let {
            dataSize,
            layers,
            onClick,
            onWheel,
            size,
            slicerScopeProps: { cross, colors },
            letters,
            title
          } = plane;
          return (
            <div
              className={stockStyles["title-view-container"]}
              style={{ width: size.width, height: size.height + 40 }}
            >
              {i !== 2 ? <div className={stockStyles.title}>{title}</div> : ""}
              <View
                key={letters}
                onClick={onClick}
                onWheel={onWheel}
                size={size}
                dataSize={dataSize}
              >
                <LettersLayer
                  fontSize={fontSize || 18}
                  color={color || "#000"}
                  letters={letters}
                />
                <SlicerGuideLines
                  cross={cross}
                  thickness={this.state.quotient / 2}
                  colors={colors}
                />
                {layers.map((elem, i) => {
                  let { props } = elem;
                  let element = (
                    <elem.component key={letters + "_" + i} {...props} />
                  );
                  return element;
                })}
              </View>
              {i === 2 ? <div className={stockStyles.title}>{title}</div> : ""}
            </div>
          );
        })}
      </div>
    );
  }
}

Slicer.defaultProps = {
  dataSize: {
    width: DATA_WIDTH,
    height: DATA_HEIGHT,
    depth: DATA_DEPTH
  },
  onClick: function(dataCoords) {},
  coronal: [],
  sagittal: [],
  transverse: [],
  lettersLayer: {}
};

Slicer.propTypes = {
  onClick: PropTypes.func.isRequired,
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    depth: PropTypes.number.isRequired
  }).isRequired,
  dataSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    depth: PropTypes.number.isRequired
  }).isRequired,
  coronal: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.any.isRequired,
      props: PropTypes.any.isRequired
    })
  ).isRequired,
  sagittal: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.any.isRequired,
      props: PropTypes.any.isRequired
    })
  ).isRequired,
  transverse: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.any.isRequired,
      props: PropTypes.any.isRequired
    })
  ).isRequired,
  lettersLayer: PropTypes.shape({
    fontSize: PropTypes.number,
    color: PropTypes.string
  })
};

export function formPlanarWithThreeDimensional(
  sizes,
  dataSizes,
  pointArray,
  radius
) {
  let { width, height, depth } = sizes;
  let { dataWidth, dataHeight, dataDepth } = dataSizes;

  const coronal = new UIntArrayShaper(
    dataWidth,
    dataHeight,
    width,
    height,
    pointArray.map(element => {
      let { x, y, color } = element;
      return {
        x,
        y,
        color
      };
    }),
    radius
  );
  const sagittal = new UIntArrayShaper(
    dataDepth,
    dataHeight,
    depth,
    height,
    pointArray.map(element => {
      let { y, z, color } = element;
      return {
        x: z,
        y,
        color
      };
    }),
    radius
  );
  const transverse = new UIntArrayShaper(
    dataWidth,
    dataDepth,
    width,
    depth,
    pointArray.map(element => {
      let { x, z, color } = element;
      return {
        x,
        y: z,
        color
      };
    }),
    radius
  );
  return {
    coronal: coronal.getData(),
    sagittal: sagittal.getData(),
    transverse: transverse.getData()
  };
}
