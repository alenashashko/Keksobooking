'use strict';

window.map = (function () {
  var typeOfAccommodationFilter = document.querySelector('#housing-type');
  var announcements = [];
  var errorMessageTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
  var mainElement = document.querySelector('main');
  var mainPin = document.querySelector('.map__pin--main');

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

  var openCard = function (announcement) {
    var cardCLoseButton = document.querySelector('.popup__close');

    window.card.createUniqueAnnouncementCard(announcement);

    document.addEventListener('keydown', openedCardEscPressHandler);

    cardCLoseButton.addEventListener('click', function () {
      closeCard();
    });
  };

  var closeCard = function () {
    if (window.card.getAnnouncementCard()) {
      window.card.getAnnouncementCard().remove();
      window.card.setEmptyAnnouncementCard();
    }

    document.removeEventListener('keydown', openedCardEscPressHandler);
  };

  var getAnnouncements = function () {
    return announcements; // return current state
  };

  var addHandlersToMainPin = function () {
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinEnterPressHandler);
  };

  var removeHandlersFromMainPin = function () {
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
  };

  var mainPinMousedownHandler = function (evt) {
    if (window.util.isMouseLeftButtonEvent(evt)) {
      window.page.setActivePageStatus();
      removeHandlersFromMainPin();
    }
  };

  var mainPinEnterPressHandler = function (evt) {
    if (window.util.isEnterEvent(evt)) {
      window.page.setActivePageStatus();
      removeHandlersFromMainPin();
    }
  };

  var openedCardEscPressHandler = function (evt) {
    if (window.util.isEscapeEvent(evt)) {
      evt.preventDefault();
      closeCard();
    }
  };

  typeOfAccommodationFilter.addEventListener('change', function () {
    window.pins.filterByTypeOfAccommodation(typeOfAccommodationFilter.value);
  });

  return {
    closeCard: closeCard,
    openCard: openCard,
    load: load,
    announcements: getAnnouncements,
    addHandlersToMainPin: addHandlersToMainPin
  };
})();
