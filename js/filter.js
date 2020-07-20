'use strict';

window.filter = (function () {
  var mapFiltersForm = document.querySelector('.map__filters');
  var typeOfAccommodationFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var numberOfRoomsFilter = document.querySelector('#housing-rooms');
  var numberOfGuestsFilter = document.querySelector('#housing-guests');
  var featuresFilter = document.querySelector('#housing-features');

  var checkedFeatureValues = [];

  var isTypeOfAccommodationMatches = function (pin) {
    return pin.offer.type === typeOfAccommodationFilter.value || typeOfAccommodationFilter.value === 'any';
  };

  var isPriceMatches = function (pin) {
    var priceOfAccommodation;

    if (pin.offer.price < 10000) { // правильно, что это условие проверяется для каждого пина?
      priceOfAccommodation = 'low';
    } else if (pin.offer.price >= 10000 && pin.offer.price <= 50000) {
      priceOfAccommodation = 'middle';
    } else if (pin.offer.price > 50000) {
      priceOfAccommodation = 'high';
    }

    return priceOfAccommodation === priceFilter.value || priceFilter.value === 'any';
  };

  var isRoomsNumberMatches = function (pin) {
    return pin.offer.rooms === +numberOfRoomsFilter.value || numberOfRoomsFilter.value === 'any';
  };

  var isGuestsNumberMatches = function (pin) {
    return pin.offer.guests === +numberOfGuestsFilter.value || numberOfGuestsFilter.value === 'any';
  };

  var isFeaturesMatches = function () {
    // Array.from(checkedFeatureValues).every(function (feature) {

    // });
  };

  // фильтр по удобствам и добавить его в if

  var filter = function (data) {
    var filteredData = [];

    for (var i = 0; i < data.length; i++) { // использую for вместо forEach, тк нужен break
      var pin = data[i];

      if (isTypeOfAccommodationMatches(pin) && isPriceMatches(pin)
        && isRoomsNumberMatches(pin) && isGuestsNumberMatches(pin) && isFeaturesMatches()) {
        filteredData.push(pin);
      }
      if (filteredData.length === 5) {
        break;
      }
    }

    return filteredData;
  };

  mapFiltersForm.addEventListener('change', function () {
    checkedFeatureValues = [];

    var checkedFeatures = featuresFilter.querySelectorAll('input[type=checkbox]:checked');

    Array.from(checkedFeatures).forEach(function (feature) {
      if (checkedFeatureValues.indexOf(feature.value) === -1) {
        checkedFeatureValues.push(feature.value);
      }
    });
    console.log(checkedFeatureValues);
    window.pins.drawPins(window.pins.getAnnouncements());
  });

  return {
    data: filter
  };
})();
// window.card.closeCard();
/*
     логика прогона всех данных через каждый фильтр нарушает критерий
    */
