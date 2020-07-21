'use strict';

window.filter = (function () {
  var MAX_SIMILAR_ANNOUNCEMENTS_QUANTITY = 5;

  var AveragePriceOfAccommodation = {
    MIN: 10000,
    MAX: 50000
  };

  var mapFiltersForm = document.querySelector('.map__filters');
  var typeOfAccommodationFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var quantityOfRoomsFilter = document.querySelector('#housing-rooms');
  var quantityOfGuestsFilter = document.querySelector('#housing-guests');
  var featuresFilter = document.querySelector('#housing-features');

  var chosenFeatureValues = [];

  var isTypeOfAccommodationMatches = function (announcement) {
    return announcement.offer.type === typeOfAccommodationFilter.value
      || typeOfAccommodationFilter.value === 'any';
  };

  var getPriceOfAccommodationInText = function (announcement) {
    var priceOfAccommodation;

    if (announcement.offer.price < AveragePriceOfAccommodation.MIN) {
      priceOfAccommodation = 'low';
    } else if (announcement.offer.price >= AveragePriceOfAccommodation.MIN
        && announcement.offer.price <= AveragePriceOfAccommodation.MAX) {
      priceOfAccommodation = 'middle';
    } else if (announcement.offer.price > AveragePriceOfAccommodation.MAX) {
      priceOfAccommodation = 'high';
    }

    return priceOfAccommodation;
  };

  var isPriceMatches = function (announcement) {
    return getPriceOfAccommodationInText(announcement) === priceFilter.value
      || priceFilter.value === 'any';
  };

  var isRoomsQuantityMatches = function (announcement) {
    return announcement.offer.rooms === +quantityOfRoomsFilter.value
      || quantityOfRoomsFilter.value === 'any';
  };

  var isGuestsQuantityMatches = function (announcement) {
    return announcement.offer.guests === +quantityOfGuestsFilter.value
      || quantityOfGuestsFilter.value === 'any';
  };

  var isFeaturesMatches = function (announcement) {
    var features = announcement.offer.features;
    var isMatching = chosenFeatureValues.every(function (chosenValue) {
      return features.indexOf(chosenValue) !== -1;
    });

    return isMatching;
  };

  var getFilteredData = function (data) {
    var filteredData = [];

    for (var i = 0; i < data.length; i++) {
      var announcement = data[i];

      if (isTypeOfAccommodationMatches(announcement) && isPriceMatches(announcement)
        && isRoomsQuantityMatches(announcement) && isGuestsQuantityMatches(announcement)
        && isFeaturesMatches(announcement) && announcement.offer) {
        filteredData.push(announcement);
      }
      if (filteredData.length === MAX_SIMILAR_ANNOUNCEMENTS_QUANTITY) {
        break;
      }
    }

    return filteredData;
  };

  var findChosenFeatureValues = function () {
    var chosenFeatures = featuresFilter.querySelectorAll('input[type=checkbox]:checked');

    chosenFeatureValues = [];

    Array.from(chosenFeatures).forEach(function (feature) {
      chosenFeatureValues.push(feature.value);
    });
  };

  mapFiltersForm.addEventListener('change', function () {
    window.card.closeCard();
    findChosenFeatureValues();
    window.pins.drawPins(window.pins.getAnnouncements());
  });

  return {
    mapFiltersForm: mapFiltersForm,
    data: getFilteredData
  };
})();
