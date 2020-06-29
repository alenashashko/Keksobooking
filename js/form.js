'use strict';

window.form = (function () {
  var minPricesOfAccommodation = {
    'palace': '10000',
    'flat': '1000',
    'house': '5000',
    'bungalo': '0'
  };

  var typeOfAccommodation = document.querySelector('#type');
  var priceOfAccommodation = document.querySelector('#price');
  var numberOfRooms = document.querySelector('#room_number');
  var numberOfGuests = document.querySelector('#capacity');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var announcementFormReset = document.querySelector('.ad-form__reset');

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

  announcementFormReset.addEventListener('click', function () {
    window.main.setInactivePageStatus();
  });
})();
