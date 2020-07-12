'use strict';

window.page = (function () {
  var map = document.querySelector('.map');
  var announcementForm = document.querySelector('.ad-form');
  var announcementFormFieldsets = announcementForm.querySelectorAll('fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFilters = mapFiltersForm.children;
  var mapPinControl = document.querySelector('.map__pin--main');
  var announcementFormReset = document.querySelector('.ad-form__reset');
  var announcements = [];

  var toggleDisabledElementsAttribute = function (elements, isDisabled) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = isDisabled;
    }
  };

  var setActivePageStatus = function () {
    map.classList.remove('map--faded');
    announcementForm.classList.remove('ad-form--disabled');
    window.pins.drawMapPins(announcements);
    window.form.setAddressValue('active');
    toggleDisabledElementsAttribute(announcementFormFieldsets, false);
    toggleDisabledElementsAttribute(mapFilters, false);
  };

  var setInactivePageStatus = function () {
    var mapPins = document.querySelectorAll('button.map__pin:not(.map__pin--main)');
    map.classList.add('map--faded');
    mapPinControl.style.top = '375px';
    mapPinControl.style.left = '570px';
    announcementForm.classList.add('ad-form--disabled');
    window.form.setAddressValue('inactive');
    for (var i = 0; i < mapPins.length; i++) {
      mapPins[i].remove();
    }
    window.map.closeCard();
    toggleDisabledElementsAttribute(announcementFormFieldsets, true);
    toggleDisabledElementsAttribute(mapFilters, true);
    mapPinControl.addEventListener('mousedown', mapPinControlMousedownHandler);
    mapPinControl.addEventListener('keydown', MapPinControlEnterPressHandler);
  };

  var successHandler = function (data) {
    announcements = data;
  };

  var errorHandler = function () { // будет сообщение об ошибке
  };

  var mapPinControlMousedownHandler = function (evt) {
    if (window.util.isMouseLeftButtonEvent(evt)) {
      setActivePageStatus();
      mapPinControl.removeEventListener('mousedown', mapPinControlMousedownHandler);
      mapPinControl.removeEventListener('keydown', MapPinControlEnterPressHandler);
    }
  };

  var MapPinControlEnterPressHandler = function (evt) {
    if (window.util.isEnterEvent(evt)) {
      setActivePageStatus();
      mapPinControl.removeEventListener('mousedown', mapPinControlMousedownHandler);
      mapPinControl.removeEventListener('keydown', MapPinControlEnterPressHandler);
    }
  };

  announcementFormReset.addEventListener('click', function () {
    setInactivePageStatus();
  });

  var windowLoadHandler = function () {
    window.backend.loadData(successHandler, errorHandler);
  };

  window.addEventListener('load', windowLoadHandler);

  return {
    setInactivePageStatus: setInactivePageStatus
  };
})();
