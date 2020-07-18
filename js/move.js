'use strict';

(function () {
  var MainPinSize = {
    TOTAL_HEIGHT: 84,
    WIDTH: 65
  };

  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var wasMainPinMoved = false;
  var mapData;
  var mouseOffsetX;
  var mouseOffsetY;

  var mainPinCoordsLimit = {
    maxX: map.offsetWidth,
    maxY: 630,
    minX: 0,
    minY: 130
  };

  var getPinControlTipCoords = function (minCoord, maxCoord, currentCoord) {
    return Math.max(minCoord, Math.min(maxCoord, currentCoord));
  };

  var movePinControl = function (evt) {
    var mainPinCoords = {
      x: evt.clientX - mapData.left - mouseOffsetX,
      y: evt.clientY - mapData.top - mouseOffsetY
    };

    mainPin.style.left = getPinControlTipCoords(mainPinCoordsLimit.minX, mainPinCoordsLimit.maxX, mainPinCoords.x + MainPinSize.WIDTH / 2) - Math.round(MainPinSize.WIDTH / 2) + 'px';

    mainPin.style.top = getPinControlTipCoords(mainPinCoordsLimit.minY, mainPinCoordsLimit.maxY, mainPinCoords.y + MainPinSize.TOTAL_HEIGHT) - MainPinSize.TOTAL_HEIGHT + 'px';

    window.form.setAddressValue('active');
  };

  var mouseMoveHandler = function (moveEvt) {
    wasMainPinMoved = true;

    movePinControl(moveEvt);
  };

  var mouseUpHandler = function (upEvt) {
    if (wasMainPinMoved) {
      movePinControl(upEvt);
    }

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  mainPin.addEventListener('mousedown', function (evt) {
    if (window.util.isMouseLeftButtonEvent(evt)) {
      mapData = map.getBoundingClientRect();
      mouseOffsetX = evt.clientX - mapData.left - mainPin.offsetLeft;
      mouseOffsetY = evt.clientY - mapData.top - mainPin.offsetTop;
      window.addEventListener('scroll', function () {
        mapData = map.getBoundingClientRect();
      });
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    }
  });
})();
