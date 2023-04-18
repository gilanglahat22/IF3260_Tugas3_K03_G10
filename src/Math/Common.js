const EPSILON = 0.000001;

function toRadian(degrees) {
  return (degrees * Math.PI) / 180;
}

function flatten(array) {
  return array.reduce((acc, val) => acc.concat(val), []);
}