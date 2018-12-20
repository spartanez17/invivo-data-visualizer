# invivo-data-visualizer

>

There are some components for viewing points on the plane.

[![NPM](https://img.shields.io/npm/v/invivo-data-visualizer.svg)](https://www.npmjs.com/package/invivo-data-visualizer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install invivo-data-visualizer --save
```

## Usage

That is all you can import from this package:

```jsx
import {
  ImageLayer,
  PointLayer,
  Slicer,
  formPlanarWithThreeDimensional,
  View,
  UIntArraySharper,
  utils,
  RoiToolbox,
  constants
} from "invivo-data-visualizer";
```

####ImageLayer & PointLayer
ImageLayer & PointLayer are simple canvas layers which take Uint8ClampedArray.

```jsx
<PointLayer
  dataArray={UInt8ClampedArray}
  size={Object}
  className={String}
  zIndex={Number}
/>

<ImageLayer
  src={String}
  alt={String}
  size={Object}
  className={String}
  zIndex={Number}
/>
```

Props
| Prop | ImageLayer | PointLayer | Type | Default | Description |
|-----------|------------|------------|-------------------|---------|---------------------------------------------------------------------------------------|
| className | + | + | string | "" | string with classNames you want to add. All layers have absolute position by default. |
| zIndex | + | + | number | | z-index for current layer |
| size | + | + | object | | Object with width and height numbers: { width: 60, height: 160 } |
| dataArray | | + | UInt8ClampedArray | | Array for creating ImageData object and putting it to the canvas. [MDN link](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas) |
| src | + | | string | "" | src for tag <img> |
| alt | + | | string | "" | alt for tag <img> |

> ####UIntArraySharper
> UIntArraySharper class for converting your array with 2d points into UInt8ClampedArray.

######constructor():
dataWidth and dataHeight - original data dimensions.
width and height - required data dimensions.
Attention! width:dataWidth should be equal to height:dataHeight

pointArray structure:
`[ ... { x, y, color: { r: (0-255), g: (0-255), b: (0-255), a: (0-255) } }, ... ]`

x, y - coordinates in original dimension;
r(red), g(green), b(blue), a(alpha) in range of 0-255.

radius is integer value which isn't scaling.

```jsx
//Empty shaper
var shaper = new UIntArrayShaper(dataWidth, dataHeight, width, height);

// Shaper with filled points
var shaper = new UIntArrayShaper(
  dataWidth,
  dataHeight,
  width,
  height,
  pointArray
);

// Shaper with filled circles by points
var shaper = new UIntArrayShaper(
  dataWidth,
  dataHeight,
  width,
  height,
  pointArray,
  radius
);
```

######fillScaledPoints(points):

Takes array with points in original sizes.
Scale and draw it.

```jsx
shaper.fillScaledPoints(points);
```

######fillCirclesByPoints(points, radius):

Takes array with points in original sizes.
Draw radial-gradient circles by points.

```jsx
shaper.fillCirclesByPoints(points, radius);
```

######getData():
Just return a UInt8ClampedArray

####View
View component is a wrapper for several canvas layers.
View passes prop `size` to all children, also gives them `z-index`.

onClick method provide:
browser display coordinates - current element inner coordinates;
data coordinates - coodinates of original dimension.

```jsx
handleClick = (browserDisplayCoords, dataCoords) => {
  const { x: x1, y: y1 } = browserDisplayCoords;
  const { x: x2, y: y2 } = dataCoords;
};
...
<View
  onClick={this.handleClick}
  size={{ width, height }}
  dataSize={{ width: dataWidth, height: dataHeight }}
>
  <ImageLayer src={src1} /> // the lowest z-index ...
  <ImageLayer src={src2} />
  <PointLayer dataArray={dataArray1} />
  ...
  <PointLayer dataArray={dataArray2} /> // the highest z-index
</View>;
```

####Slicer
Slicer component enables to display three-dimensional arrays of points.
`formPlanarWithThreeDimensional()` function split 3 dimensional array into three two-dimensional arrays:
Coronal, Sagittal, Transverse views, - and return three UInt8ClampedArray objects.

onClick provides click coordinates of original dimension.

coronal, sagittal, transverse are arrays with layer components info:

- component name;
- props to pass.

```jsx
handleClick = dataCoords => {
  const { x: x2, y: y2 } = dataCoords;
};

render(){
  ...
  const { coronal, sagittal, transverse } = formPlanarWithThreeDimensional(
        { width, height, depth },
        { dataWidth, dataHeight, dataDepth },
        pointArray,
        radius
      );
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
  <Slicer
    onClick={this.handleClick}
    size={{ width, height, depth }}
    dataSize={{
      dataWidth,
      dataHeight,
      dataDepth
    }}

    coronal={vivoPlot.coronal}
    sagittal={vivoPlot.sagittal}
    transverse={vivoPlot.transverse}
  />)
};
```

####RoiToolbox

RoiToolbox component is simple toolbox with radius value and 3 states:

- `ERASE`
- `FILL`
- `VOID`

```jsx

onToolChange = roiToolbox => {
  const {value};
};
...
<RoiToolbox width={25} onToolChange={this.onToolChange} />;
```

## License

MIT © [spartanez17](https://github.com/spartanez17)
