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

  var mapPinControlCoordsLimits = {
    minX: 0,
    maxX: map.offsetWidth,
    minY: 130,
    maxY: 630,
  };

  window.addEventListener('scroll', function () {
    mapData = map.getBoundingClientRect();
  });

  var getPinControlTipCoords = function (minCoord, maxCoord, currentCoord) {
    return Math.max(minCoord, Math.min(maxCoord, currentCoord));
  };

  var movePinControl = function (evt) {
    var mapPinControlCoords = {
      x: evt.clientX - mapData.left - mouseOffsetX,
      y: evt.clientY - mapData.top - mouseOffsetY
    };

    mapPinControl.style.left = getPinControlTipCoords(mapPinControlCoordsLimits.minX, mapPinControlCoordsLimits.maxX, mapPinControlCoords.x + MapPinControlSizes.WIDTH / 2) - Math.round(MapPinControlSizes.WIDTH / 2) + 'px';

    mapPinControl.style.top = getPinControlTipCoords(mapPinControlCoordsLimits.minY, mapPinControlCoordsLimits.maxY, mapPinControlCoords.y + MapPinControlSizes.TOTAL_HEIGHT) - MapPinControlSizes.TOTAL_HEIGHT + 'px';

    window.form.setAddressValue('active');
  };

  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();
    wasMapPinControlMoved = true;

    movePinControl(moveEvt);
  };

  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault();
    if (wasMapPinControlMoved) {
      movePinControl(upEvt);
    }

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  mapPinControl.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    if (window.util.isMouseLeftButtonEvent(evt)) {
      mouseOffsetX = evt.clientX - mapData.left - mapPinControl.offsetLeft;
      mouseOffsetY = evt.clientY - mapData.top - mapPinControl.offsetTop;
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    }
  });
})();
