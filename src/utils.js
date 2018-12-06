const countFourthOfCircle = (primaryCoord, secondaryCoord, r) => {
  let fourth = [];
  for (
    let i = Math.round(primaryCoord - r / Math.sqrt(2));
    i <= primaryCoord + r;
    i++
  ) {
    let sec = Math.round(
      Math.sqrt(r ** 2 - (i - primaryCoord) ** 2) + secondaryCoord
    );
    let backSec = Math.round(
      -Math.sqrt(r ** 2 - (i - primaryCoord) ** 2) + secondaryCoord
    );
    fourth.push({
      pr: i,
      sec,
      backSec
    });
  }
  return fourth;
};

const createPointMapForCircle = (xC, yC, r) => {
  let pointMap = Object.create(null);
  let primaryX = countFourthOfCircle(xC, yC, r);
  let primaryY = countFourthOfCircle(yC, xC, r);

  primaryX.forEach(el => {
    let { pr, sec, backSec } = el;
    pointMap[pr + " " + sec] = 1;
    pointMap[pr + " " + backSec] = 1;
  });

  primaryY.forEach(el => {
    let { pr, sec, backSec } = el;
    pointMap[sec + " " + pr] = 1;
    pointMap[backSec + " " + pr] = 1;
  });

  return pointMap;
};

const pointMapToArray = pointMap => {
  let coordinates = [];
  for (let key in pointMap) {
    let [x, y] = key.split(" ").map(c => +c);
    if (!coordinates[x]) {
      coordinates[x] = { minY: +Infinity, maxY: -Infinity };
    }
    coordinates[x].minY = coordinates[x].minY < y ? coordinates[x].minY : y;
    coordinates[x].maxY = coordinates[x].maxY > y ? coordinates[x].maxY : y;
  }
  let result = coordinates
    .map(({ minY, maxY }, index) => {
      return { x: index, yTopBorder: maxY, yBottomBorder: minY };
    })
    .filter(el => !!el);
  return result;
};

const findVerticalPointLine = (x, yStart, yEnd, color) => {
  let result = [];
  for (let y = yStart; y < yEnd; y++) {
    result.push({
      x,
      y,
      color
    });
  }
  return result;
};

export function findUnfilledCircle(
  xCenter,
  yCenter,
  outerRadius,
  innerRadius,
  color
) {
  let result = [];
  const circleOuterBorder = findCircleBorder(xCenter, yCenter, outerRadius);
  const circleInnerBorder = findCircleBorder(xCenter, yCenter, innerRadius);
  const separator = Math.ceil(outerRadius - innerRadius);
  for (let i = 0; i < separator; i++) {
    let {
      x: xL,
      yTopBorder: yTopBorderL,
      yBottomBorder: yBottomBorderL
    } = circleOuterBorder[i];
    let {
      x: xR,
      yTopBorder: yTopBorderR,
      yBottomBorder: yBottomBorderR
    } = circleOuterBorder[circleOuterBorder.length - i - 1];
    result = result
      .concat(findVerticalPointLine(xL, yBottomBorderL, yTopBorderL, color))
      .concat(findVerticalPointLine(xR, yBottomBorderR, yTopBorderR, color));
  }
  for (let i = separator; i < circleOuterBorder.length - separator; i++) {
    let {
      x,
      yTopBorder: yTopBorderOuter,
      yBottomBorder: yBottomBorderOuter
    } = circleOuterBorder[i];
    let {
      yTopBorder: yTopBorderInner,
      yBottomBorder: yBottomBorderInner
    } = circleInnerBorder[i - separator];

    result = result
      .concat(findVerticalPointLine(x, yTopBorderInner, yTopBorderOuter, color))
      .concat(
        findVerticalPointLine(x, yBottomBorderOuter, yBottomBorderInner, color)
      );
  }
  return result;
}

export function findFilledCircle(xCenter, yCenter, radius, color) {
  let result = [];
  const circleBorder = findCircleBorder(xCenter, yCenter, radius);
  circleBorder.forEach(el => {
    let { x, yTopBorder, yBottomBorder } = el;
    for (let iy = yBottomBorder; iy <= yTopBorder; iy++) {
      result.push({
        x,
        y: iy,
        color: color
      });
    }
  });
  return result;
}

export function findCircleBorder(xCenter, yCenter, radius) {
  const pointMap = createPointMapForCircle(xCenter, yCenter, radius);
  const coordinates = pointMapToArray(pointMap);
  return coordinates;
}

export function countDistance(xStart, yStart, xEnd, yEnd) {
  return Math.floor(Math.sqrt((xStart - xEnd) ** 2 + (yStart - yEnd) ** 2));
}

export const transposedCoord = (xToTransp, yToTransp, height) => ({
  xTransp: xToTransp,
  yTransp: height - yToTransp
});

export const getProjectedPoint = (currCoords, currSize, reqSize) => {
  let coef = currSize.width / reqSize.width;
  return {
    xCoef: Math.floor(currCoords.x * coef),
    yCoef: Math.floor(currCoords.y * coef)
  };
};

export const separateData = dataSet3d => {
  if (!Array.isArray(dataSet3d)) {
    return [];
  }
  let dataArrayCoronal = [];

  let dataArraySagittal = [];

  let dataArrayTransverse = [];
  dataSet3d.forEach(layer => {
    layer.forEach(layerPoint => {
      let { x, y, z, color } = layerPoint;
      dataArrayCoronal.push({ x, y, color });
      dataArraySagittal.push({ x: y, y: z, color });
      dataArrayTransverse.push({ x, y: z, color });
    });
  });
  return { dataArrayCoronal, dataArraySagittal, dataArrayTransverse };
};
