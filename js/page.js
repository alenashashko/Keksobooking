'use strict';

window.page = (function () {
  var map = document.querySelector('.map');
  var announcementForm = document.querySelector('.ad-form');
  var announcementFormFieldsets = announcementForm.querySelectorAll('fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFilters = mapFiltersForm.children;
  var mapPinControl = document.querySelector('.map__pin--main');
  var announcementFormReset = document.querySelector('.ad-form__reset');

  var toggleDisabledElementsAttribute = function (elements, isDisabled) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = isDisabled;
    }
  };

  var setActivePageStatus = function () {
    var announcements = window.data.getAnnouncementsArray();
    map.classList.remove('map--faded');
    announcementForm.classList.remove('ad-form--disabled');
    window.pin.drawMapPins(announcements); // при каждом нажатии на центральный пин происходит отрисовка рандомных пинов
    window.form.setAddressValue('active');
    toggleDisabledElementsAttribute(announcementFormFieldsets, false);
    toggleDisabledElementsAttribute(mapFilters, false);
  };

  var setInactivePageStatus = function () {
    var mapPins = document.querySelectorAll('button.map__pin:not(.map__pin--main)');
    map.classList.add('map--faded');
    announcementForm.classList.add('ad-form--disabled');
    window.form.setAddressValue('inactive');
    for (var i = 0; i < mapPins.length; i++) {
      mapPins[i].remove();
    }
    window.map.closeCard();
    toggleDisabledElementsAttribute(announcementFormFieldsets, true);
    toggleDisabledElementsAttribute(mapFilters, true);
  };

  mapPinControl.addEventListener('mousedown', function (evt) { // главный пин перемещаем только зажатой левой КМ или любой?
    if (window.util.isMouseLeftButtonEvent(evt)) {
      evt.preventDefault(); // ?
      setActivePageStatus();

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var mouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault(); // ?

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        mapPinControl.style.top = (mapPinControl.offsetTop - shift.y) + 'px';
        mapPinControl.style.left = (mapPinControl.offsetLeft - shift.x) + 'px';
      };

      var mouseUpHandler = function (upEvt) {
        upEvt.preventDefault(); // ?

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    }
  });

  mapPinControl.addEventListener('keydown', function (evt) {
    if (window.util.isEnterEvent(evt)) {
      setActivePageStatus();
    }
  });

  announcementFormReset.addEventListener('click', function () {
    setInactivePageStatus();
  });

  return {
    setInactivePageStatus: setInactivePageStatus
  };
})();
