'use strict';

var typeOfAccommodationFilter = document.querySelector('#housing-type');

var filterByTypeOfAccommodation = function (selectedType) {
  window.page.removePins();
  window.card.closeCard();

  window.pins.drawMapPins(window.pins.getAnnouncements().filter(function (it) {
    return it.offer.type === selectedType;
  }));
};

typeOfAccommodationFilter.addEventListener('change', function () {
  filterByTypeOfAccommodation(typeOfAccommodationFilter.value);
});
