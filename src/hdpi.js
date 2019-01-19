export function getRetinaRatioOf(c) {
  var devicePixelRatio = window.devicePixelRatio || 1
  var backingStoreRatio = [
      c.webkitBackingStorePixelRatio,
      c.mozBackingStorePixelRatio,
      c.msBackingStorePixelRatio,
      c.oBackingStorePixelRatio,
      c.backingStorePixelRatio,
      1
  ].reduce(function(a, b) { return a || b })

  return devicePixelRatio / backingStoreRatio
}