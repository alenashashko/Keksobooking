'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinControl = document.querySelector('.map__pin--main');

  var mapData = map.getBoundingClientRect();

  var movePin = function (evt) {
    var mapPinControlCoords = {
      x: evt.clientX - mapData.left,
      y: evt.clientY - mapData.top
    };

    mapPinControl.style.top = mapPinControlCoords.y;
    mapPinControl.style.left = mapPinControlCoords.x;
  };

  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault(); // ?

    movePin(moveEvt);
  };

  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault(); // ?

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  mapPinControl.addEventListener('mousedown', function (evt) { // главный пин перемещаем только зажатой левой КМ или любой?
    evt.preventDefault(); // ?

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
