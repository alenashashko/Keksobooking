'use strict';

(function () {
  var MapPinControlSize = {
    TOTAL_HEIGHT: 84,
    WIDTH: 65
  };

  var mapPinControlCoordsLimit = {
    maxX: map.offsetWidth,
    maxY: 630,
    minX: 0,
    minY: 130
  };

  var map = document.querySelector('.map');
  var mapPinControl = document.querySelector('.map__pin--main');
  var wasMapPinControlMoved = false;
  var mapData;
  var mouseOffsetX;
  var mouseOffsetY;

  var getPinControlTipCoords = function (minCoord, maxCoord, currentCoord) {
    return Math.max(minCoord, Math.min(maxCoord, currentCoord));
  };

  var movePinControl = function (evt) {
    var mapPinControlCoords = {
      x: evt.clientX - mapData.left - mouseOffsetX,
      y: evt.clientY - mapData.top - mouseOffsetY
    };

    mapPinControl.style.left = getPinControlTipCoords(mapPinControlCoordsLimit.minX, mapPinControlCoordsLimit.maxX, mapPinControlCoords.x + MapPinControlSize.WIDTH / 2) - Math.round(MapPinControlSize.WIDTH / 2) + 'px';

    mapPinControl.style.top = getPinControlTipCoords(mapPinControlCoordsLimit.minY, mapPinControlCoordsLimit.maxY, mapPinControlCoords.y + MapPinControlSize.TOTAL_HEIGHT) - MapPinControlSize.TOTAL_HEIGHT + 'px';

    window.form.setAddressValue('active');
  };

  var mouseMoveHandler = function (moveEvt) {
    wasMapPinControlMoved = true;

    movePinControl(moveEvt);
  };

  var mouseUpHandler = function (upEvt) {
    if (wasMapPinControlMoved) {
      movePinControl(upEvt);
    }

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  mapPinControl.addEventListener('mousedown', function (evt) {
    if (window.util.isMouseLeftButtonEvent(evt)) {
      mapData = map.getBoundingClientRect();
      mouseOffsetX = evt.clientX - mapData.left - mapPinControl.offsetLeft;
      mouseOffsetY = evt.clientY - mapData.top - mapPinControl.offsetTop;
      window.addEventListener('scroll', function () {
        mapData = map.getBoundingClientRect();
      });
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    }
  });
})();
