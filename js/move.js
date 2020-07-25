'use strict';

window.move = (function () {
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

  var mainPinCoordsLimitListMap = {
    'maxX': map.offsetWidth,
    'maxY': '630',
    'minX': '0',
    'minY': '130'
  };

  var getMainPinTipCoords = function (minCoord, maxCoord, currentCoord) {
    return Math.max(minCoord, Math.min(maxCoord, currentCoord));
  };

  var moveMainPin = function (evt) {
    var mainPinCoords = {
      x: evt.clientX - mapData.left - mouseOffsetX,
      y: evt.clientY - mapData.top - mouseOffsetY
    };

    mainPin.style.left = getMainPinTipCoords(mainPinCoordsLimitListMap.minX, mainPinCoordsLimitListMap.maxX, mainPinCoords.x
      + MainPinSize.WIDTH / 2) - Math.round(MainPinSize.WIDTH / 2) + 'px';
    mainPin.style.top = getMainPinTipCoords(mainPinCoordsLimitListMap.minY, mainPinCoordsLimitListMap.maxY, mainPinCoords.y
      + MainPinSize.TOTAL_HEIGHT)
     - MainPinSize.TOTAL_HEIGHT + 'px';

    window.form.setAddressValue('active');
  };

  var mouseMoveHandler = function (moveEvt) {
    wasMainPinMoved = true;

    moveMainPin(moveEvt);
  };

  var mouseUpHandler = function (upEvt) {
    if (wasMainPinMoved) {
      moveMainPin(upEvt);
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
