import {
  countDistance,
  transposedCoord,
  getProjectedPoint,
  findFilledCircle
} from "./utils";

export default class UIntArrayShaper {
  constructor(dataWidth, dataHeight, width, height, points, radius) {
    this._uIntArr = new Uint8ClampedArray(width * height * 4);
    this._dataHeight = dataHeight;
    this._dataWidth = dataWidth;
    this._width = width;
    this._height = height;
    if (points) {
      if (radius) {
        this.fillCirclesByPoints(points, radius);
      } else {
        this.fillScaledPoints(points);
      }
    }
  }

  fillScaledPoints(points) {
    this._fillPointArray(points, this._findScaledPointArea);
  }

  fillCirclesByPoints(points, radius) {
    let r = radius || (this._width / this._dataWidth) * 2;
    this._fillPointArray(points, this._fillCircleByPoint.bind(this, r));
  }

  getData() {
    return this._uIntArr;
  }

  _fillPointArray(points, transformAreaFunction) {
    points.forEach(point => {
      let { x, y, color } = point;

      let currSize = { width: this._width, height: this._height };
      let reqSize = { width: this._dataWidth, height: this._dataHeight };
      let { xTransp, yTransp } = transposedCoord(x, y, this._dataHeight);
      let { xCoef, yCoef } = getProjectedPoint(
        { x: xTransp, y: yTransp },
        currSize,
        reqSize
      );
      let area = transformAreaFunction(xCoef, yCoef, color);
      area.forEach(({ x, y, color }) => this._fillOnePoint(x, y, color));
    });
  }

  _findScaledPointArea = (x, y, color) => {
    let xScaleCoef = this._width / this._dataWidth;
    let yScaleCoef = this._height / this._dataHeight;
    let resultArea = [];
    for (let ix = x; ix < x + xScaleCoef; ix++) {
      for (let iy = y - 1; iy > y - 1 - yScaleCoef; iy--) {
        resultArea.push({ x: ix, y: iy, color });
      }
    }
    return resultArea;
  };

  _fillOnePoint(x, y, color) {
    let indexRed = y * this._width * 4 + x * 4;
    this._uIntArr[indexRed] = color.r;
    this._uIntArr[indexRed + 1] = color.g;
    this._uIntArr[indexRed + 2] = color.b;
    this._uIntArr[indexRed + 3] =
      this._uIntArr[indexRed + 3] < color.a
        ? color.a
        : this._uIntArr[indexRed + 3];
  }

  _countGradientAlpha(
    xCenter,
    yCenter,
    x,
    y,
    xScaleCoef,
    yScaleCoef,
    maxAlpha,
    radius
  ) {
    let maxA = maxAlpha || 255;
    let distFromCenter = countDistance(
      xCenter + xScaleCoef / 2 - 1,
      yCenter + yScaleCoef / 2 - 1,
      x,
      y
    );
    return Math.round(maxA * (1 - distFromCenter / radius));
  }

  _fillCircleByPoint = (r, xC, yC, color) => {
    let resultArea = [];
    let xScaleCoef = Math.ceil(this._width / this._dataWidth);
    let yScaleCoef = Math.ceil(this._height / this._dataHeight);
    let circleBorder = findFilledCircle(xC, yC, r);
    circleBorder = circleBorder.filter(element => element.x < this._width);
    circleBorder.forEach(element => {
      const { x, y } = element;
      let newAlpha = this._countGradientAlpha(
        xC,
        yC,
        x,
        y,
        xScaleCoef,
        yScaleCoef,
        color.a,
        r
      );

      let newColor = {
        ...color,
        a: newAlpha
      };
      resultArea.push({ x, y, color: newColor });
    });
    return resultArea;
  };
}
