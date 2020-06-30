'use strict';

window.page = (function () {
  var MOUSE_LEFT_BUTTON = 0;

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
    window.pin.drawMapPins(announcements);
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
    setInactivePageStatus();
  });

  return {
    setInactivePageStatus: setInactivePageStatus
  };
})();
