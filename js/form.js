'use strict';

window.form = (function () {
  var MainPinSize = {
    HEIGHT: 62,
    POINTER_HEIGHT: 22,
    WIDTH: 65
  };

  var typeOfAccommodation = document.querySelector('#type');
  var priceOfAccommodation = document.querySelector('#price');
  var numberOfRooms = document.querySelector('#room_number');
  var numberOfGuests = document.querySelector('#capacity');
  var mainPin = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var form = document.querySelector('.ad-form');
  var announcementFormReset = document.querySelector('.ad-form__reset');
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
    var mainPinLeftCoordinate = parseInt(mainPin.style.left, 10);
    var mainPinTopCoordinate = parseInt(mainPin.style.top, 10);
    var additionToLeftCoordinate = MainPinSize.WIDTH / 2;
    var additionToTopCoordinate = (pageStatus === 'active') ? (MainPinSize.HEIGHT + MainPinSize.POINTER_HEIGHT) :
      MainPinSize.HEIGHT / 2;

    addressInput.value = Math.round(mainPinLeftCoordinate + additionToLeftCoordinate) + ', ' +
      Math.round(mainPinTopCoordinate + additionToTopCoordinate);
  };

  var save = {
    successHandler: function () {
      var successMessage = successMessageTemplate.cloneNode(true);

      window.page.setInactivePageStatus();
      form.reset();
      window.form.setAddressValue('inactive');
      mainElement.appendChild(successMessage);

      var openedSuccessMessageEscapePressHandler = function (evt) {
        if (window.util.isEscapeEvent(evt)) {
          evt.preventDefault();
          successMessage.remove();
          document.removeEventListener('keydown', openedSuccessMessageEscapePressHandler);
        }
      };

      successMessage.addEventListener('click', function (evt) {
        if (evt.target === successMessage) {
          successMessage.remove();
          document.removeEventListener('keydown', openedSuccessMessageEscapePressHandler);
        }
      });

      document.addEventListener('keydown', openedSuccessMessageEscapePressHandler);
    },
    errorHandler: function () {
      var errorMessage = errorMessageTemplate.cloneNode(true);
      var errorButton = errorMessage.querySelector('.error__button');

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
    window.backend.saveData(save.successHandler, save.errorHandler, new FormData(form));
  });

  announcementFormReset.addEventListener('click', function () {
    window.page.setInactivePageStatus();
    window.filter.mapFiltersForm.reset();
    form.reset();
    setAddressValue('inactive');
  });

  return {
    validateMinPrice: validateMinPrice,
    validateGuestsCount: validateGuestsCount,
    setAddressValue: setAddressValue
  };
})();
