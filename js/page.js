'use strict';

window.page = (function () {
  var MainPinStartPosition = {
    TOP: '375px',
    LEFT: '570px'
  };

  var map = document.querySelector('.map');
  var announcementForm = document.querySelector('.ad-form');
  var announcementFormFieldsets = announcementForm.querySelectorAll('fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFilters = mapFiltersForm.children;
  var mainPin = document.querySelector('.map__pin--main');

  var toggleDisabledElementsAttribute = function (elements, isDisabled) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = isDisabled;
    }
  };

  var setActivePageStatus = function () {
    map.classList.remove('map--faded');
    announcementForm.classList.remove('ad-form--disabled');

    window.pins.drawMapPins(window.map.announcements());
    window.form.setAddressValue('active');
    toggleDisabledElementsAttribute(announcementFormFieldsets, false);
    toggleDisabledElementsAttribute(mapFilters, false); // ? при непустом массиве объявлений
  };

  var setInactivePageStatus = function () {
    // clear/reset map and form
    var mapPins = document.querySelectorAll('button.map__pin:not(.map__pin--main)');

    map.classList.add('map--faded');
    announcementForm.classList.add('ad-form--disabled');

    mainPin.style.top = MainPinStartPosition.TOP;
    mainPin.style.left = MainPinStartPosition.LEFT;

    for (var i = 0; i < mapPins.length; i++) {
      mapPins[i].remove();
    }

    window.form.setAddressValue('inactive');
    window.map.closeCard();

    toggleDisabledElementsAttribute(announcementFormFieldsets, true);
    toggleDisabledElementsAttribute(mapFilters, true);

    // load new data
    window.backend.loadData(window.map.load.successHandler, window.map.load.errorHandler);

    // init functions
    window.map.addHandlersToMainPin();
  };

  return {
    setInactivePageStatus: setInactivePageStatus,
    setActivePageStatus: setActivePageStatus
  };
})();
