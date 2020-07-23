'use strict';

window.form = (function () {
  var ROOMS_QUANTITY_NOT_FOR_GUESTS = 100;

  var MainPinSize = {
    HEIGHT: 62,
    POINTER_HEIGHT: 22,
    WIDTH: 65
  };

  var typeOfAccommodationChooser = document.querySelector('#type');
  var priceOfAccommodationChooser = document.querySelector('#price');
  var quantityOfRoomsChooser = document.querySelector('#room_number');
  var quantityOfGuestsChooser = document.querySelector('#capacity');
  var mainPin = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');
  var timeInChooser = document.querySelector('#timein');
  var timeOutChooser = document.querySelector('#timeout');
  var announcementForm = document.querySelector('.ad-form');
  var announcementFormReset = document.querySelector('.ad-form__reset');
  var successMessageTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  var mainContainer = document.querySelector('main');
  var invalidFields = [];

  var accommodationTypeToPrice = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };

  var validateMinPrice = function () {
    priceOfAccommodationChooser.min = priceOfAccommodationChooser.placeholder
      = accommodationTypeToPrice[typeOfAccommodationChooser.value];
  };

  var validateGuestsQuantity = function () {
    if ((+quantityOfRoomsChooser.value >= +quantityOfGuestsChooser.value) && +quantityOfRoomsChooser.value
      !== ROOMS_QUANTITY_NOT_FOR_GUESTS && +quantityOfGuestsChooser.value !== 0) {
      quantityOfGuestsChooser.setCustomValidity('');
    } else if (+quantityOfRoomsChooser.value === ROOMS_QUANTITY_NOT_FOR_GUESTS
        && +quantityOfGuestsChooser.value === 0) {
      quantityOfGuestsChooser.setCustomValidity('');
    } else {
      quantityOfGuestsChooser.setCustomValidity('Количество комнат не соответствует количеству гостей');
    }
  };

  var setAddressValue = function (pageStatus) {
    var mainPinLeftCoordinate = parseInt(mainPin.style.left, 10);
    var mainPinTopCoordinate = parseInt(mainPin.style.top, 10);
    var additionToLeftCoordinate = MainPinSize.WIDTH / 2;
    var additionToTopCoordinate = (pageStatus === 'active') ?
      (MainPinSize.HEIGHT + MainPinSize.POINTER_HEIGHT) : MainPinSize.HEIGHT / 2;

    addressInput.value = Math.round(mainPinLeftCoordinate + additionToLeftCoordinate) + ', ' +
      Math.round(mainPinTopCoordinate + additionToTopCoordinate);
  };

  var save = {
    successHandler: function () {
      var successMessage = successMessageTemplate.cloneNode(true);

      window.page.setInactiveStatus();
      window.filter.mapForm.reset();
      announcementForm.reset();
      window.form.setAddressValue('inactive');
      mainContainer.appendChild(successMessage);

      var openedSuccessMessageEscapePressHandler = function (evt) {
        if (window.util.isEscapeEvent(evt)) {
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

      mainContainer.appendChild(errorMessage);

      var openedErrorMessageEscapePressHandler = function (evt) {
        if (window.util.isEscapeEvent(evt)) {
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

  typeOfAccommodationChooser.addEventListener('change', function () {
    validateMinPrice();
  });

  quantityOfGuestsChooser.addEventListener('change', function () {
    validateGuestsQuantity();
  });

  quantityOfRoomsChooser.addEventListener('change', function () {
    validateGuestsQuantity();
  });

  timeInChooser.addEventListener('change', function () {
    timeOutChooser.value = timeInChooser.value;
  });

  timeOutChooser.addEventListener('change', function () {
    timeInChooser.value = timeOutChooser.value;
  });

  announcementForm.addEventListener('change', function (evt) {
    if (evt.target.validity.valid) {
      evt.target.style.border = '';
    } else {
      evt.target.style.border = '2px solid red';
    }
  });

  announcementForm.addEventListener('invalid', function (evt) {
    invalidFields.push(evt.target);
    evt.target.style.border = '2px solid red';
  }, true);

  announcementForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.saveData(save.successHandler, save.errorHandler, new FormData(announcementForm));
  });

  announcementFormReset.addEventListener('click', function () {
    invalidFields.forEach(function (it) {
      it.style.border = '';
    });

    window.page.setInactiveStatus();
    window.filter.mapForm.reset();
    announcementForm.reset();
    setAddressValue('inactive');
  });

  return {
    validateMinPrice: validateMinPrice,
    validateGuestsQuantity: validateGuestsQuantity,
    setAddressValue: setAddressValue
  };
})();
