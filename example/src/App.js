import React, { Component } from "react";
import {
  ImageLayer,
  PointLayer,
  RoiToolbox,
  View,
  Slicer,
  formPlanarWithThreeDimensional,
  constants
} from "invivo-data-visualizer";

import image1 from "./assets/images/skeleton_gray.png";
import image2 from "./assets/images/roi-preview-mouse.png";
import points from "./assets/serverData/peaks.json";
import "./App.css";

const { DATA_WIDTH, DATA_HEIGHT, DATA_DEPTH } = constants.supposedDataSizes;
const width = DATA_WIDTH * 4;
const height = DATA_HEIGHT * 4;
const depth = DATA_DEPTH * 4;

class App extends Component {
  constructor() {
    super();
    let pointArray = points.map(element => {
      return {
        x: element.point[0],
        y: element.point[1],
        z: element.point[2],
        color: { r: 255, g: 0, b: 0, a: 255 }
      };
    });
    pointArray = pointArray.slice(0, 6);

    const slicerProps = formPlanarWithThreeDimensional(
      { width, height, depth },
      { dataWidth: DATA_WIDTH, dataHeight: DATA_HEIGHT, dataDepth: DATA_DEPTH },
      pointArray,
      8
    );

    this.state = {
      slProps: slicerProps
    };
  }

  handleClick = dataCoords => {
    let { x, y, z } = dataCoords;
    console.log(x, y, z);
  };

  onToolChange = roiToolbox => {
    this.setState(roiToolbox, () => console.log(this.state.roiToolbox));
  };

  render() {
    const { coronal, sagittal, transverse } = this.state.slProps;
    const vivoPlot = {
      coronal: [
        {
          component: PointLayer,
          props: {
            dataArray: coronal
          }
        },
        {
          component: ImageLayer,
          props: {
            src: image1
          }
        },
        {
          component: ImageLayer,
          props: {
            src: image2
          }
        }
      ],
      sagittal: [
        {
          component: PointLayer,
          props: {
            dataArray: sagittal
          }
        }
      ],
      transverse: [
        {
          component: PointLayer,
          props: {
            dataArray: transverse
          }
        }
      ]
    };
    return (
      <div className="container">
        <RoiToolbox width={25} onToolChange={this.onToolChange} />
        <Slicer
          onClick={this.handleClick}
          size={{ width, height, depth }}
          dataSize={{
            width: DATA_WIDTH,
            height: DATA_HEIGHT,
            depth: DATA_DEPTH
          }}
          coronal={vivoPlot.coronal}
          sagittal={vivoPlot.sagittal}
          transverse={vivoPlot.transverse}
        />

        <View
          onClick={args => console.log(args)}
          size={{ width, height }}
          dataSize={{ width: DATA_WIDTH, height: DATA_HEIGHT }}
        >
          <PointLayer dataArray={coronal} />
        </View>
      </div>
    );
  }
}

export default App;
