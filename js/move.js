'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinControl = document.querySelector('.map__pin--main');

  var wasMapPinControlMoved = false;
  var mapData = map.getBoundingClientRect();

  window.addEventListener('scroll', function () {
    mapData = map.getBoundingClientRect();
  });

  var movePin = function (evt) {
    var mapPinControlCoords = {
      x: evt.clientX - mapData.left - 32.5,
      y: evt.clientY - mapData.top - 31
    };

    mapPinControl.style.top = mapPinControlCoords.y + 'px';
    mapPinControl.style.left = mapPinControlCoords.x + 'px';
  };

  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault(); // ?
    wasMapPinControlMoved = true;

    movePin(moveEvt);
  };

  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault(); // ?
    if (wasMapPinControlMoved) {
      movePin(upEvt);
    }

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  mapPinControl.addEventListener('mousedown', function (evt) { // главный пин перемещаем только зажатой левой КМ или любой?
    evt.preventDefault(); // ?

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
