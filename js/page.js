'use strict';

window.page = (function () {
  var MainPinStartPosition = {
    TOP: '375px',
    LEFT: '570px'
  };

  var map = document.querySelector('.map');
  var announcementForm = document.querySelector('.ad-form');
  var announcementFormFieldsets = announcementForm.querySelectorAll('fieldset');
  var mapFilters = window.filter.mapForm.children;
  var featuresFromMapFilters = document.querySelectorAll('.map__feature');
  var mainPin = document.querySelector('.map__pin--main');

  var toggleDisabledElementsAttribute = function (elements, isDisabled) {
    Array.from(elements).forEach(function (it) {
      it.disabled = isDisabled;
    });
  };

  var setActivePageStatus = function () {
    map.classList.remove('map--faded');
    announcementForm.classList.remove('ad-form--disabled');

    // load new data
    // window.backend.loadData(window.pins.load.successHandler, window.pins.load.errorHandler);
    // use mocks
    window.pins.load.successHandler(window.mocks.getAnnouncementsArray());

    window.form.setAddressValue('active');
    toggleDisabledElementsAttribute(announcementFormFieldsets, false);
  };

  var setInactivePageStatus = function () {
    // clear/reset map and form
    map.classList.add('map--faded');
    announcementForm.classList.add('ad-form--disabled');

    mainPin.style.top = MainPinStartPosition.TOP;
    mainPin.style.left = MainPinStartPosition.LEFT;

    window.form.setAddressValue('inactive');
    window.pins.remove();
    window.card.close();

    toggleDisabledElementsAttribute(announcementFormFieldsets, true);
    toggleDisabledElementsAttribute(mapFilters, true);

    Array.from(mapFilters).forEach(function (filter) {
      filter.style.cursor = 'default';
    });
    Array.from(featuresFromMapFilters).forEach(function (feature) {
      feature.style.cursor = 'default';
    });

    window.loadFiles.deleteAvatar();
    window.loadFiles.deleteAccommodationPhoto();

    // init functions
    window.map.addHandlersToMainPin();
  };

  return {
    mapFilters: mapFilters,
    featuresFromMapFilters: featuresFromMapFilters,
    setActiveStatus: setActivePageStatus,
    setInactiveStatus: setInactivePageStatus,
    toggleDisabledElementsAttribute: toggleDisabledElementsAttribute
  };
})();
