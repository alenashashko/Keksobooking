'use strict';

window.pins = (function () {
  var PinSize = {
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
  var pinsList = document.querySelector('.map__pins');
  var activePin;

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

  var getUniquePin = function (announcement) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.style.left = announcement.location.x - PinSize.WIDTH / 2 + 'px';
    pinElement.style.top = announcement.location.y - PinSize.HEIGHT + 'px';

    pinImage.src = announcement.author.avatar;
    pinImage.alt = announcement.offer.title;

    pinElement.addEventListener('click', function () {
      if (activePin === pinElement) {
        return;
      }

      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }

      pinElement.classList.add('map__pin--active');
      window.card.close();
      window.card.open(announcement);

      activePin = pinElement;
    });

    return pinElement;
  };

  var removePins = function () {
    var pins = document.querySelectorAll('button.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  };

  var drawPins = function (data) {
    var filteredData = window.filter.data(data);
    var fragment = document.createDocumentFragment();

    // remove current pins
    removePins();

    // draw new pins
    filteredData.forEach(function (pin) {
      var uniquePin = getUniquePin(pin);
      fragment.appendChild(uniquePin);
    });

    pinsList.appendChild(fragment);
  };

  var getAnnouncements = function () {
    return announcements; // return current state
  };

  return {
    load: load,
    remove: removePins,
    draw: window.util.debounce(drawPins),
    getAnnouncements: getAnnouncements
  };
})();
