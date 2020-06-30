'use strict';

window.map = (function () {
  var openCard = function (announcement) {
    window.card.createUniqueAnnouncementCard(announcement);
    document.addEventListener('keydown', openedCardEscPressHandler);
    var cardCLoseButton = document.querySelector('.popup__close');
    cardCLoseButton.addEventListener('click', function () {
      closeCard();
    });
  };

  var closeCard = function () {
    if (window.card.getAnnouncementCard()) {
      window.card.getAnnouncementCard().remove();
      window.card.removeAnnouncementCard();
    }

    document.removeEventListener('keydown', openedCardEscPressHandler);
  };

  var openedCardEscPressHandler = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeCard();
    }
  };

  return {
    closeCard: closeCard,
    openCard: openCard
  };
})();
