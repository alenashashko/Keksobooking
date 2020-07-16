'use strict';

window.page = (function () {
  var MapPinControlStartPosition = {
    TOP: '375px',
    LEFT: '570px'
  };

  var map = document.querySelector('.map');
  var announcementForm = document.querySelector('.ad-form');
  var announcementFormFieldsets = announcementForm.querySelectorAll('fieldset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFilters = mapFiltersForm.children;
  var mapPinControl = document.querySelector('.map__pin--main');
  var announcementFormReset = document.querySelector('.ad-form__reset');
  var announcements = [];
  var errorMessageTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var mainElement = document.querySelector('main');
  var form = document.querySelector('.ad-form');

  var loadHandler = {
    success: function (data) {
      announcements = data;
    },
    error: function (message) {
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
    toggleDisabledElementsAttribute(mapFilters, false);
  };

  var setInactivePageStatus = function () {
    var mapPins = document.querySelectorAll('button.map__pin:not(.map__pin--main)');
    map.classList.add('map--faded');
    mapPinControl.style.top = MapPinControlStartPosition.TOP;
    mapPinControl.style.left = MapPinControlStartPosition.LEFT;
    announcementForm.classList.add('ad-form--disabled');
    window.form.setAddressValue('inactive');
    for (var i = 0; i < mapPins.length; i++) {
      mapPins[i].remove();
    }
    window.map.closeCard();
    window.backend.loadData(loadHandler.success, loadHandler.error);
    toggleDisabledElementsAttribute(announcementFormFieldsets, true);
    toggleDisabledElementsAttribute(mapFilters, true);
    mapPinControl.addEventListener('mousedown', mapPinControlMousedownHandler);
    mapPinControl.addEventListener('keydown', mapPinControlEnterPressHandler);
  };

  var mapPinControlMousedownHandler = function (evt) {
    if (window.util.isMouseLeftButtonEvent(evt)) {
      setActivePageStatus();
      mapPinControl.removeEventListener('mousedown', mapPinControlMousedownHandler);
      mapPinControl.removeEventListener('keydown', mapPinControlEnterPressHandler);
    }
  };

  var mapPinControlEnterPressHandler = function (evt) {
    if (window.util.isEnterEvent(evt)) {
      setActivePageStatus();
      mapPinControl.removeEventListener('mousedown', mapPinControlMousedownHandler);
      mapPinControl.removeEventListener('keydown', mapPinControlEnterPressHandler);
    }
  };

  announcementFormReset.addEventListener('click', function () {
    setInactivePageStatus();
    form.reset();
    window.form.setAddressValue('inactive');
  });

  return {
    setInactivePageStatus: setInactivePageStatus
  };
})();
