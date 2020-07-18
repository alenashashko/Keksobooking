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

  var removePins = function () {
    var pins = document.querySelectorAll('button.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  };

  var setActivePageStatus = function () {
    map.classList.remove('map--faded');
    announcementForm.classList.remove('ad-form--disabled');

    window.pins.drawMapPins(window.pins.getAnnouncements());

    window.form.setAddressValue('active');
    toggleDisabledElementsAttribute(announcementFormFieldsets, false);
    toggleDisabledElementsAttribute(mapFilters, false); // ? при непустом массиве объявлений
  };

  var setInactivePageStatus = function () {
    // clear/reset map and form

    map.classList.add('map--faded');
    announcementForm.classList.add('ad-form--disabled');

    mainPin.style.top = MainPinStartPosition.TOP;
    mainPin.style.left = MainPinStartPosition.LEFT;

    window.form.setAddressValue('inactive');
    removePins();
    window.card.closeCard();

    toggleDisabledElementsAttribute(announcementFormFieldsets, true);
    toggleDisabledElementsAttribute(mapFilters, true);

    // load new data
    window.backend.loadData(window.pins.load.successHandler, window.pins.load.errorHandler);

    // init functions
    window.map.addHandlersToMainPin();
  };

  return {
    setActivePageStatus: setActivePageStatus,
    setInactivePageStatus: setInactivePageStatus,
    removePins: removePins
  };
})();
