'use strict';

window.form = (function () {
  var MapPinControlSize = {
    HEIGHT: 62,
    POINTER_HEIGHT: 22,
    WIDTH: 65
  };

  var typeOfAccommodation = document.querySelector('#type');
  var priceOfAccommodation = document.querySelector('#price');
  var numberOfRooms = document.querySelector('#room_number');
  var numberOfGuests = document.querySelector('#capacity');
  var mapPinControl = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var form = document.querySelector('.ad-form');
  var successMessageTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var mainElement = document.querySelector('main');

  var minPricesOfAccommodation = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };

  var validateMinPrice = function () {
    priceOfAccommodation.min = priceOfAccommodation.placeholder = minPricesOfAccommodation[typeOfAccommodation.value];
  };

  var validateGuestsCount = function () { // переделать
    if ((+numberOfRooms.value >= +numberOfGuests.value) && +numberOfRooms.value !== 100 && +numberOfGuests.value !== 0) {
      numberOfGuests.setCustomValidity('');
    } else if (+numberOfRooms.value === 100 && +numberOfGuests.value === 0) {
      numberOfGuests.setCustomValidity('');
    } else {
      numberOfGuests.setCustomValidity('Количество комнат не соответствует количеству гостей');
    }
  };

  var setAddressValue = function (pageStatus) {
    var mapPinControlLeftCoordinate = parseInt(mapPinControl.style.left, 10);
    var mapPinControlTopCoordinate = parseInt(mapPinControl.style.top, 10);
    var additionToLeftCoordinate = MapPinControlSize.WIDTH / 2;
    var additionToTopCoordinate = (pageStatus === 'active') ? (MapPinControlSize.HEIGHT + MapPinControlSize.POINTER_HEIGHT) :
      MapPinControlSize.HEIGHT / 2;
    addressInput.value = Math.round(mapPinControlLeftCoordinate + additionToLeftCoordinate) + ', ' +
    Math.round(mapPinControlTopCoordinate + additionToTopCoordinate);
  };

  var saveSuccessHandler = function () {
    window.page.setInactivePageStatus();
    form.reset();
    window.form.setAddressValue('inactive');
    var successMessage = successMessageTemplate.cloneNode(true);
    mainElement.appendChild(successMessage);
    var OpenedSuccessMessageEscapePressHandler = function (evt) {
      // написала обработчик внутри функции, так как в нем используется successMessage локальная переменная - так нормально?
      if (window.util.isEscapeEvent(evt)) {
        evt.preventDefault();
        successMessage.remove();
        document.removeEventListener('keydown', OpenedSuccessMessageEscapePressHandler);
      }
    };
    successMessage.addEventListener('click', function (evt) {
      if (evt.target === successMessage) {
        successMessage.remove();
        document.removeEventListener('keydown', OpenedSuccessMessageEscapePressHandler);
      }
    });
    document.addEventListener('keydown', OpenedSuccessMessageEscapePressHandler);
  };

  var saveErrorHandler = function () {
    var errorMessage = errorMessageTemplate.cloneNode(true);
    var errorButton = errorMessage.querySelector('.error__button');
    mainElement.appendChild(errorMessage);
    var OpenedErrorMessageEscapePressHandler = function (evt) {
      // написала обработчик внутри функции, так как в нем используется errorMessage локальная переменная - так нормально?
      if (window.util.isEscapeEvent(evt)) {
        evt.preventDefault();
        errorMessage.remove();
        document.removeEventListener('keydown', OpenedErrorMessageEscapePressHandler);
      }
    };
    errorButton.addEventListener('click', function () {
      errorMessage.remove();
      document.removeEventListener('keydown', OpenedErrorMessageEscapePressHandler);
    });
    errorMessage.addEventListener('click', function (evt) {
      if (evt.target === errorMessage) {
        errorMessage.remove();
        document.removeEventListener('keydown', OpenedErrorMessageEscapePressHandler);
      }
    });
    document.addEventListener('keydown', OpenedErrorMessageEscapePressHandler);
  };

  typeOfAccommodation.addEventListener('change', function () {
    validateMinPrice();
  });

  numberOfGuests.addEventListener('change', function () {
    validateGuestsCount();
  });

  numberOfRooms.addEventListener('change', function () {
    validateGuestsCount();
  });

  timeIn.addEventListener('change', function () {
    timeOut.value = timeIn.value;
  });

  timeOut.addEventListener('change', function () {
    timeIn.value = timeOut.value;
  });

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.saveData(saveSuccessHandler, saveErrorHandler, new FormData(form));
  });

  return {
    validateMinPrice: validateMinPrice,
    validateGuestsCount: validateGuestsCount,
    setAddressValue: setAddressValue
  };
})();
