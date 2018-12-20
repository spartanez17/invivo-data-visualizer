import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "react-rangeslider";
import View from "../View";
import PointLayer from "../PointLayer";
import UIntArrayShaper from "../../UIntArrayShaper";
import { findUnfilledCircle, findFilledCircle } from "../../utils";
import SlicerGuideLines from "../SlicerGuideLines";
import {
  toolboxRoiValues as values,
  toolboxSelectColors as colors
} from "../../constants";

import rsl from "react-rangeslider/lib/index.css";
import stockStyles from "./styles.css";

export default class RoiToolbox extends Component {
  constructor(props) {
    super(props);
    let { width, color } = this.props;
    const circles = createDataArrays(width, color);
    this.state = {
      circles: circles,
      value: values.VOID,
      radius: 6
    };
  }

  handleChangeComplete = subState => {
    const { value, radius } = this.state;
    this.props.onToolChange({ roiToolbox: { value, radius } });
  };

  handleChange = subState => {
    this.setState(subState);
  };

  render() {
    let {
      value,
      radius,
      circles: {
        selectedFilledData: selectedFilled,
        unselectedFilledData: unselectedFilled,
        selectedData: selected,
        unselectedData: unselected
      }
    } = this.state;

    let { width, color } = this.props;
    let selectColor = color || colors.GREEN;

    let size = {
      width,
      height: width
    };

    return (
      <div className={stockStyles["roi-toolbox-cont"]}>
        <View
          className={stockStyles["roi-toolbox-elem"]}
          size={size}
          onClick={() => {
            this.handleChange({ value: values.VOID });
          }}
          styles={
            value === values.VOID
              ? { boxShadow: `0 0 1px 1px ${selectColor}`, borderRadius: "5%" }
              : null
          }
        >
          <SlicerGuideLines
            cross={{ x: width / 2, y: width / 2 }}
            thickness={1}
            colors={
              value === values.VOID
                ? { v: selectColor, h: selectColor }
                : { v: colors.GREY, h: colors.GREY }
            }
          />
        </View>
        <View
          className={stockStyles["roi-toolbox-elem"]}
          size={size}
          onClick={() => {
            this.handleChange({ value: values.FILL });
          }}
          styles={
            value === values.FILL
              ? { boxShadow: `0 0 1px 1px ${colors.GREY}`, borderRadius: "5%" }
              : null
          }
        >
          <PointLayer
            dataArray={
              value === values.FILL
                ? selectedFilled.getData()
                : unselectedFilled.getData()
            }
          />
        </View>
        <View
          className={stockStyles["roi-toolbox-elem"]}
          size={size}
          onClick={() => {
            this.handleChange({ value: values.ERASE });
          }}
          styles={
            value === values.ERASE
              ? { boxShadow: `0 0 1px 1px ${selectColor}`, borderRadius: "5%" }
              : null
          }
        >
          <PointLayer
            dataArray={
              value === values.ERASE ? selected.getData() : unselected.getData()
            }
          />
        </View>
        <Slider
          min={1}
          max={20}
          step={1}
          value={radius}
          orientation={"vertical"}
          tooltip={true}
          onChange={currentRadius => {
            this.handleChange({ radius: currentRadius });
          }}
          onChangeComplete={this.handleChangeComplete}
        />
        <span>{this.state.radius}</span>
      </div>
    );
  }
}

RoiToolbox.defaultProps = {
  className: "",
};

RoiToolbox.propTypes = {
  className: PropTypes.string,
  onToolChange: PropTypes.func.isRequired,
  width: PropTypes.number,
  color: PropTypes.string
};

const createDataArrays = (width, color) => {
  let center = Math.floor(width / 2);
  let radius = Math.floor(width / 2.8);

  const activeRGBA = color || stringRGBAtoObject(colors.GREEN);
  const greyRGBA = stringRGBAtoObject(colors.GREY);

  let filledCircle = findFilledCircle(center, center, radius);
  let unfilledCircle = findUnfilledCircle(center, center, radius, radius - 1);

  let filledCirclePicked = fillArrayWithColor(filledCircle, activeRGBA);
  let filledCircleUnpicked = fillArrayWithColor(filledCircle, greyRGBA);
  let unfilledCirclePicked = fillArrayWithColor(unfilledCircle, activeRGBA);
  let unfilledCircleUnpicked = fillArrayWithColor(unfilledCircle, greyRGBA);

  const selectedFilledData = createSquareUIntArraySharper(
    width,
    filledCirclePicked
  );

  const unselectedFilledData = createSquareUIntArraySharper(
    width,
    filledCircleUnpicked
  );

  const selectedData = createSquareUIntArraySharper(
    width,
    unfilledCirclePicked
  );

  const unselectedData = createSquareUIntArraySharper(
    width,
    unfilledCircleUnpicked
  );
  return {
    selectedFilledData,
    unselectedFilledData,
    selectedData,
    unselectedData
  };
};

const fillArrayWithColor = (array, color) => {
  return array.map(({ x, y }) => ({
    x,
    y,
    color
  }));
};

const createSquareUIntArraySharper = (side, dataArray) => {
  return new UIntArrayShaper(side, side, side, side, dataArray);
};

const stringRGBAtoObject = color => {
  let colors = color
    .replace(/[^0-9|,|.]*/g, "")
    .split(",")
    .map(str => +str);
  return {
    r: colors[0],
    g: colors[1],
    b: colors[2],
    a: Math.round(colors[3] * 255)
  };
};
