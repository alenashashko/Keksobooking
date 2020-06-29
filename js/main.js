'use strict';

(function () {
  var MOUSE_LEFT_BUTTON = 0;

  var MapPinControlSizes = {
    WIDTH: 65,
    HEIGHT: 62,
    POINTER_HEIGHT: 22
  };

  var map = document.querySelector('.map');
  var announcementForm = document.querySelector('.ad-form');
  var announcementFormFieldsets = announcementForm.querySelectorAll('fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFilters = mapFiltersForm.children;
  var mapPinControl = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');
  var announcementFormReset = document.querySelector('.ad-form__reset');

  var toggleDisabledElementsAttribute = function (elements, isDisabled) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = isDisabled;
    }
  };

  var setAddressValue = function (pageStatus) {
    var mapPinControlLeftCoordinate = parseInt(mapPinControl.style.left, 10);
    var mapPinControlTopCoordinate = parseInt(mapPinControl.style.top, 10);
    var additionToLeftCoordinate = MapPinControlSizes.WIDTH / 2;
    var additionToTopCoordinate = (pageStatus === 'active') ? (MapPinControlSizes.HEIGHT + MapPinControlSizes.POINTER_HEIGHT) :
      MapPinControlSizes.HEIGHT / 2;
    addressInput.value = Math.round(mapPinControlLeftCoordinate + additionToLeftCoordinate) + ', ' +
    Math.round(mapPinControlTopCoordinate + additionToTopCoordinate);
  };

  var setActivePageStatus = function () {
    var announcements = window.data.getAnnouncementsArray();
    map.classList.remove('map--faded');
    announcementForm.classList.remove('ad-form--disabled');
    window.pin.drawMapPins(announcements);
    setAddressValue('active');
    toggleDisabledElementsAttribute(announcementFormFieldsets, false);
    toggleDisabledElementsAttribute(mapFilters, false);
  };

  var setInactivePageStatus = function () {
    var mapPins = document.querySelectorAll('button.map__pin:not(.map__pin--main)');
    map.classList.add('map--faded');
    announcementForm.classList.add('ad-form--disabled');
    setAddressValue('inactive');
    for (var i = 0; i < mapPins.length; i++) {
      mapPins[i].remove();
    }
    window.map.closeCard();
    toggleDisabledElementsAttribute(announcementFormFieldsets, true);
    toggleDisabledElementsAttribute(mapFilters, true);
  };

  var windowLoadHandler = function () {
    setInactivePageStatus();
    window.form.validateMinPrice();
    window.form.validateGuestsCount();
  };

  mapPinControl.addEventListener('mousedown', function (evt) {
    if (evt.button === MOUSE_LEFT_BUTTON) {
      setActivePageStatus();
    }
  });

  mapPinControl.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      setActivePageStatus();
    }
  });

  announcementFormReset.addEventListener('click', function () {
    window.main.setInactivePageStatus();
  });

  window.addEventListener('load', windowLoadHandler);
})();
