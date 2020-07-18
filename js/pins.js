'use strict';

window.pins = (function () {
  var MAX_SIMILAR_ANNOUNCEMENTS_COUNT = 5;

  var MapPinSize = {
    HEIGHT: 70,
    WIDTH: 50
  };

  var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
  var mapPinsList = document.querySelector('.map__pins');

  var getUniqueMapPin = function (announcement) {
    var pinElement = mapPinTemplate.cloneNode(true);
    pinElement.style.left = announcement.location.x - MapPinSize.WIDTH / 2 + 'px';
    pinElement.style.top = announcement.location.y - MapPinSize.HEIGHT + 'px';

    var mapPinImage = pinElement.querySelector('img');
    mapPinImage.src = announcement.author.avatar;
    mapPinImage.alt = announcement.offer.title;

    pinElement.addEventListener('click', function () {
      window.map.closeCard();
      window.map.openCard(announcement);
    });
    return pinElement;
  };

  var drawMapPins = function (data) {
    var takeNumber = data.length > MAX_SIMILAR_ANNOUNCEMENTS_COUNT ? MAX_SIMILAR_ANNOUNCEMENTS_COUNT : data.length;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < takeNumber; i++) {
      if (!data[i].offer) {
        continue;
      }
      var uniqueMapPin = getUniqueMapPin(data[i]);
      fragment.appendChild(uniqueMapPin);
    }
    mapPinsList.appendChild(fragment);
  };

  var filterByTypeOfAccommodation = function (selectedType) { // удаление
    mapPinsList.innerHTML = '';
    drawMapPins(window.page.announcements().filter(function (it) {
      return it.offer.type === selectedType;
    }));
  };

  return {
    drawMapPins: drawMapPins,
    filterByTypeOfAccommodation: filterByTypeOfAccommodation
  };
})();
