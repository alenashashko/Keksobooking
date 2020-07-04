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
    MIN_X: 0,
    MAX_X: map.offsetWidth,
    MIN_Y: 130,
    MAX_Y: 630,
  };

  window.addEventListener('scroll', function () {
    mapData = map.getBoundingClientRect();
  });

  var movePin = function (evt) {
    var mapPinControlCoords = {
      x: evt.clientX - mapData.left - mouseOffsetX,
      y: evt.clientY - mapData.top - mouseOffsetY
    };

    if ((mapPinControlCoords.x + MapPinControlSizes.WIDTH / 2) <= MapPinControlCoordsLimits.MIN_X) {
      mapPinControl.style.left = MapPinControlCoordsLimits.MIN_X - Math.round(MapPinControlSizes.WIDTH / 2) + 'px';
    } else if ((mapPinControlCoords.x + MapPinControlSizes.WIDTH / 2) >= MapPinControlCoordsLimits.MAX_X) {
      mapPinControl.style.left = MapPinControlCoordsLimits.MAX_X - Math.round(MapPinControlSizes.WIDTH / 2) + 'px';
    } else {
      mapPinControl.style.left = mapPinControlCoords.x + 'px';
    }

    if ((mapPinControlCoords.y + MapPinControlSizes.TOTAL_HEIGHT) <= MapPinControlCoordsLimits.MIN_Y) { // ПРЫЖОК! + 630
      mapPinControl.style.top = MapPinControlCoordsLimits.MIN_Y - MapPinControlSizes.TOTAL_HEIGHT + 'px';
    } else if ((mapPinControlCoords.y + MapPinControlSizes.TOTAL_HEIGHT) >= MapPinControlCoordsLimits.MAX_Y) {
      mapPinControl.style.left = MapPinControlCoordsLimits.MAX_Y - MapPinControlSizes.TOTAL_HEIGHT + 'px';
    } else {
      mapPinControl.style.top = mapPinControlCoords.y + 'px';
    }
  };

  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault(); // ?
    wasMapPinControlMoved = true;

    movePin(moveEvt);
    window.form.setAddressValue('active');
  };

  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault(); // ?
    if (wasMapPinControlMoved) {
      movePin(upEvt);
      // window.form.setAddressValue('active'); нужно ли?
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
