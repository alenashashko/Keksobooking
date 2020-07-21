'use strict';

window.filter = (function () {
  var MAX_SIMILAR_ANNOUNCEMENTS_COUNT = 5;

  var mapFiltersForm = document.querySelector('.map__filters');
  var typeOfAccommodationFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var numberOfRoomsFilter = document.querySelector('#housing-rooms');
  var numberOfGuestsFilter = document.querySelector('#housing-guests');
  var featuresFilter = document.querySelector('#housing-features');

  var checkedFeatureValues = [];

  var isTypeOfAccommodationMatches = function (announcement) {
    return announcement.offer.type === typeOfAccommodationFilter.value
      || typeOfAccommodationFilter.value === 'any';
  };

  var getPriceOfAccommodationInText = function (announcement) {
    var priceOfAccommodation;

    if (announcement.offer.price < 10000) {
      priceOfAccommodation = 'low';
    } else if (announcement.offer.price >= 10000 && announcement.offer.price <= 50000) {
      priceOfAccommodation = 'middle';
    } else if (announcement.offer.price > 50000) {
      priceOfAccommodation = 'high';
    }

    return priceOfAccommodation;
  };

  var isPriceMatches = function (announcement) {
    return getPriceOfAccommodationInText(announcement) === priceFilter.value || priceFilter.value === 'any';
  };

  var isRoomsNumberMatches = function (announcement) {
    return announcement.offer.rooms === +numberOfRoomsFilter.value || numberOfRoomsFilter.value === 'any';
  };

  var isGuestsNumberMatches = function (announcement) {
    return announcement.offer.guests === +numberOfGuestsFilter.value || numberOfGuestsFilter.value === 'any';
  };

  var isFeaturesMatches = function (announcement) {
    var features = announcement.offer.features;
    var matches = checkedFeatureValues.every(function (checkedValue) {
      return features.indexOf(checkedValue) !== -1;
    });

    return matches;
  };

  var filter = function (data) {
    var filteredData = [];

    for (var i = 0; i < data.length; i++) { // использую for вместо forEach, тк нужен break
      var announcement = data[i];

      if (isTypeOfAccommodationMatches(announcement) && isPriceMatches(announcement)
        && isRoomsNumberMatches(announcement) && isGuestsNumberMatches(announcement)
        && isFeaturesMatches(announcement) && announcement.offer) { // добавила проверку существования свойства offer сюда - 5.2 ТЗ
        filteredData.push(announcement);
      }
      if (filteredData.length === MAX_SIMILAR_ANNOUNCEMENTS_COUNT) {
        break;
      }
    }

    return filteredData;
  };

  var getCheckedFeatureValues = function () {
    var checkedFeatures = featuresFilter.querySelectorAll('input[type=checkbox]:checked');

    checkedFeatureValues = [];

    Array.from(checkedFeatures).forEach(function (feature) {
      checkedFeatureValues.push(feature.value);
    });
  };

  mapFiltersForm.addEventListener('change', function () {
    window.card.closeCard();
    getCheckedFeatureValues();
    window.pins.drawPins(window.pins.getAnnouncements());
  });

  return {
    mapFiltersForm: mapFiltersForm,
    data: filter
  };
})();
