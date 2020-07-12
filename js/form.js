'use strict';

window.form = (function () {
  var MapPinControlSizes = {
    WIDTH: 65,
    HEIGHT: 62,
    POINTER_HEIGHT: 22
  };

  var typeOfAccommodation = document.querySelector('#type');
  var priceOfAccommodation = document.querySelector('#price');
  var numberOfRooms = document.querySelector('#room_number');
  var numberOfGuests = document.querySelector('#capacity');
  var mapPinControl = document.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  // var form = document.querySelector('.ad-form');

  var minPricesOfAccommodation = {
    'palace': '10000',
    'flat': '1000',
    'house': '5000',
    'bungalo': '0'
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
    var additionToLeftCoordinate = MapPinControlSizes.WIDTH / 2;
    var additionToTopCoordinate = (pageStatus === 'active') ? (MapPinControlSizes.HEIGHT + MapPinControlSizes.POINTER_HEIGHT) :
      MapPinControlSizes.HEIGHT / 2;
    addressInput.value = Math.round(mapPinControlLeftCoordinate + additionToLeftCoordinate) + ', ' +
    Math.round(mapPinControlTopCoordinate + additionToTopCoordinate);
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

  // form.addEventListener('submit', function (evt) {
  //   evt.preventDefault();
  //   saveData(new FormData(form));
  // });

  return {
    validateMinPrice: validateMinPrice,
    validateGuestsCount: validateGuestsCount,
    setAddressValue: setAddressValue
  };
})();
