'use strict';

window.pins = (function () {
  var MAX_SIMILAR_ANNOUNCEMENTS_COUNT = 5;

  var MapPinSize = {
    HEIGHT: 70,
    WIDTH: 50
  };

  var announcements = [];
  var errorMessageTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var mainElement = document.querySelector('main');
  var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
  var mapPinsList = document.querySelector('.map__pins');

  var load = {
    successHandler: function (data) {
      announcements = data;
    },
    errorHandler: function (message) {
      var errorMessage = errorMessageTemplate.cloneNode(true);
      var errorMessageText = errorMessage.querySelector('.error__message');
      var errorButton = errorMessage.querySelector('.error__button');

      errorMessageText.textContent = message;
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
        window.page.setInactivePageStatus();
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

  var getUniqueMapPin = function (announcement) {
    var pinElement = pinTemplate.cloneNode(true);
    var mapPinImage = pinElement.querySelector('img');

    pinElement.style.left = announcement.location.x - MapPinSize.WIDTH / 2 + 'px';
    pinElement.style.top = announcement.location.y - MapPinSize.HEIGHT + 'px';

    mapPinImage.src = announcement.author.avatar;
    mapPinImage.alt = announcement.offer.title;

    pinElement.addEventListener('click', function () {
      window.card.closeCard();
      window.card.openCard(announcement);
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

  var getAnnouncements = function () {
    return announcements; // return current state
  };

  return {
    load: load,
    drawMapPins: drawMapPins,
    getAnnouncements: getAnnouncements
  };
})();
