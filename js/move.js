'use strict';

(function () {
  var MapPinControlSizes = {
    WIDTH: 65,
    TOTAL_HEIGHT: 84
  };

  var map = document.querySelector('.map');
  var mapPinControl = document.querySelector('.map__pin--main');
  var mapData = map.getBoundingClientRect();
  var wasMapPinControlMoved = false;

  var mouseOffsetX;
  var mouseOffsetY;

  var MapPinControlCoordsLimits = { // порядок?
    X_MIN: 0,
    X_MAX: map.offsetWidth,
    Y_MIN: 130,
    Y_MAX: 630,
  };

  window.addEventListener('scroll', function () {
    mapData = map.getBoundingClientRect();
  });

  var getPinControlTipCoords = function (minCoord, maxCoord, currentCoord) { // первый вариант
    return Math.max(minCoord, Math.min(maxCoord, currentCoord));
  };

  // var getPinControlTipCoords = function (currentCoord, minCoord, maxCoord) { // второй вариант
  //   if (currentCoord < minCoord) {
  //     return minCoord;
  //   } else if (currentCoord > maxCoord) {
  //     return maxCoord;
  //   } else {
  //     return currentCoord;
  //   }
  // };

  // var clamp = function (number, min, max) {
  //   if (number < min) {
  //     return min;
  //   } else if (number > max) {
  //     return max;
  //   } else {
  //     return number;
  //   }
  // };

  var movePinControl = function (evt) {
    var mapPinControlCoords = {
      x: evt.clientX - mapData.left - mouseOffsetX,
      y: evt.clientY - mapData.top - mouseOffsetY
    };

    mapPinControl.style.left = getPinControlTipCoords(MapPinControlCoordsLimits.X_MIN, MapPinControlCoordsLimits.X_MAX, mapPinControlCoords.x + MapPinControlSizes.WIDTH / 2) - Math.round(MapPinControlSizes.WIDTH / 2) + 'px';

    mapPinControl.style.top = getPinControlTipCoords(MapPinControlCoordsLimits.Y_MIN, MapPinControlCoordsLimits.Y_MAX, mapPinControlCoords.y + MapPinControlSizes.TOTAL_HEIGHT) - MapPinControlSizes.TOTAL_HEIGHT + 'px';

    window.form.setAddressValue('active');
  };

  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault(); // ?
    wasMapPinControlMoved = true;

    movePinControl(moveEvt);
  };

  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault(); // ?
    if (wasMapPinControlMoved) {
      movePinControl(upEvt);
    }

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  mapPinControl.addEventListener('mousedown', function (evt) { // главный пин перемещаем только зажатой левой КМ или любой?
    evt.preventDefault(); // ?

    mouseOffsetX = evt.clientX - mapData.left - mapPinControl.offsetLeft;
    mouseOffsetY = evt.clientY - mapData.top - mapPinControl.offsetTop;

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
