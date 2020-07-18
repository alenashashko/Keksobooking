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
  var announcementFormReset = document.querySelector('.ad-form__reset');
  var announcements = [];
  var errorMessageTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var mainElement = document.querySelector('main');
  var form = document.querySelector('.ad-form');

  var load = {
    successHandler: function (data) {
      announcements = data;
    },
    errorHandler: function (message) {
      var errorMessage = errorMessageTemplate.cloneNode(true);
      var errorMessageText = errorMessage.querySelector('.error__message');
      var errorButton = errorMessage.querySelector('.error__button');

      errorMessageText.textContent = message;
      mainElement.appendChild(errorMessage);

      var openedErrorMessageEscapePressHandler = function (evt) {
        if (window.util.isEscapeEvent(evt)) {
          evt.preventDefault();
          errorMessage.remove();
          document.removeEventListener('keydown', openedErrorMessageEscapePressHandler);
        }
      };

      errorButton.addEventListener('click', function () {
        errorMessage.remove();
        setInactivePageStatus();
        document.removeEventListener('keydown', openedErrorMessageEscapePressHandler);
      });

      errorMessage.addEventListener('click', function (evt) {
        if (evt.target === errorMessage) {
          errorMessage.remove();
          document.removeEventListener('keydown', openedErrorMessageEscapePressHandler);
        }
      });

      document.addEventListener('keydown', openedErrorMessageEscapePressHandler);
    }
  };

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
    window.backend.loadData(load.successHandler, load.errorHandler);

    // init functions
    addHandlersToMainPin();
  };

  var getAnnouncements = function () {
    return announcements; // return current state
  };

  var addHandlersToMainPin = function () {
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinEnterPressHandler);
  };

  var removeHandlersFromMainPin = function () {
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
  };

  var mainPinMousedownHandler = function (evt) {
    if (window.util.isMouseLeftButtonEvent(evt)) {
      setActivePageStatus();
      removeHandlersFromMainPin();
    }
  };

  var mainPinEnterPressHandler = function (evt) {
    if (window.util.isEnterEvent(evt)) {
      setActivePageStatus();
      removeHandlersFromMainPin();
    }
  };

  announcementFormReset.addEventListener('click', function () {
    setInactivePageStatus();
    form.reset();
    window.form.setAddressValue('inactive');
  });

  return {
    setInactivePageStatus: setInactivePageStatus,
    announcements: getAnnouncements
  };
})();
