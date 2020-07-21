'use strict';

window.page = (function () {
  var MainPinStartPosition = {
    TOP: '375px',
    LEFT: '570px'
  };

  var map = document.querySelector('.map');
  var announcementForm = document.querySelector('.ad-form');
  var announcementFormFieldsets = announcementForm.querySelectorAll('fieldset');
  var mapFilters = window.filter.mapFiltersForm.children;
  var featuresFromMapFilters = document.querySelectorAll('.map__feature');
  var mainPin = document.querySelector('.map__pin--main');

  var toggleDisabledElementsAttribute = function (elements, isDisabled) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = isDisabled;
    }
  };

  var setActivePageStatus = function () {
    map.classList.remove('map--faded');
    announcementForm.classList.remove('ad-form--disabled');

    window.pins.drawPins(window.pins.getAnnouncements());

    window.form.setAddressValue('active');
    toggleDisabledElementsAttribute(announcementFormFieldsets, false);

    if (window.pins.getAnnouncements().length > 0) {
      toggleDisabledElementsAttribute(mapFilters, false);

      Array.from(mapFilters).forEach(function (filter) {
        filter.style.cursor = 'pointer';
      });
      Array.from(featuresFromMapFilters).forEach(function (feature) {
        feature.style.cursor = 'pointer';
      });
    }
  };

  var setInactivePageStatus = function () {
    // clear/reset map and form

    map.classList.add('map--faded');
    announcementForm.classList.add('ad-form--disabled');

    mainPin.style.top = MainPinStartPosition.TOP;
    mainPin.style.left = MainPinStartPosition.LEFT;

    window.form.setAddressValue('inactive');
    window.pins.removePins();
    window.card.closeCard();

    toggleDisabledElementsAttribute(announcementFormFieldsets, true);
    toggleDisabledElementsAttribute(mapFilters, true);

    Array.from(mapFilters).forEach(function (filter) {
      filter.style.cursor = 'default';
    });
    Array.from(featuresFromMapFilters).forEach(function (feature) {
      feature.style.cursor = 'default';
    });

    // load new data
    window.backend.loadData(window.pins.load.successHandler, window.pins.load.errorHandler);

    // init functions
    window.map.addHandlersToMainPin();
  };

  return {
    setActivePageStatus: setActivePageStatus,
    setInactivePageStatus: setInactivePageStatus
  };
})();
