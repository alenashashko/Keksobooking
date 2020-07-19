'use strict';

window.filter = (function () {
  var mapFiltersForm = document.querySelector('.map__filters');
  var typeOfAccommodationFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var numberOfRoomsFilter = document.querySelector('#housing-rooms');
  var numberOfGuestsFilter = document.querySelector('#housing-guests');

  var isTypeOfAccommodationMatches = function (pin) {
    return pin.offer.type === typeOfAccommodationFilter.value;
  };

  var isPriceMatches = function (pin) {
    return pin.offer.price === priceFilter.value;
  };

  var isRoomsNumberMatches = function (pin) {
    return pin.offer.rooms === numberOfRoomsFilter.value;
  };

  var isGuestsNumberMatches = function (pin) {
    return pin.offer.guests === numberOfGuestsFilter.value;
  };

  // фильтр по удобствам и добавить его в if

  var filter = function (data) {
    var filteredData = [];
    data.forEach(function (pin) {
      if (isTypeOfAccommodationMatches(pin) && isPriceMatches(pin)
        && isRoomsNumberMatches(pin) && isGuestsNumberMatches(pin)) {
        filteredData.push(pin);
      }
    });

    return filteredData;
    /* на вход массив и возвращает отфильтрованный, один пин прогоняется в цикле через все фильтры и если он их
     их прошел, то добавляется в новый массив. Набралось 5 пинов - цикл останавливаем break и return
     5 пинов
     логика прогона всех данных через каждый фильтр нарушает критерий
     при change вызывается drawPins
     change вешается на общего родителя и при любом изменении фильтра мы вызываем drawPins
    */
  };

  mapFiltersForm.addEventListener('change', function () {
    window.pins.drawPins(window.pins.getAnnouncements());
  });

  return {
    data: filter
  };
})();


var filterByTypeOfAccommodation = function (selectedType) {
  window.card.closeCard();

  window.pins.drawMapPins(window.pins.getAnnouncements().filter(function (it) {
    return it.offer.type === selectedType;
  }));
};
