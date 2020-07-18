'use strict';

window.card = (function () {
  var map = document.querySelector('.map');
  var announcementCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var announcementCard;

  var accommodationsListMap = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var createElement = function (tagName) {
    var classNames = Array.prototype.slice.call(arguments, 1);
    var element = document.createElement(tagName);

    for (var i = 0; i < classNames.length; i++) {
      element.classList.add(classNames[i]);
    }

    return element;
  };

  var createUniqueAnnouncementCard = function (announcement) {
    var cardElement = announcementCardTemplate.cloneNode(true);

    // title, address and price
    cardElement.querySelector('.popup__title').textContent = announcement.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = announcement.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = announcement.offer.price + '₽/ночь';

    // type of accommodation
    var offerType = accommodationsListMap[announcement.offer.type];

    cardElement.querySelector('.popup__type').textContent = offerType;

    // number of guests and rooms
    cardElement.querySelector('.popup__text--capacity')
      .textContent = announcement.offer.rooms + ' комнаты для ' + announcement.offer.guests + ' гостей';

    // check-in and check-out time
    cardElement.querySelector('.popup__text--time')
      .textContent = 'Заезд после ' + announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout;

    // features
    var offerFeatures = cardElement.querySelector('.popup__features');
    var fragment = document.createDocumentFragment();

    if (announcement.offer.features.length > 0) {
      for (var i = 0; i < announcement.offer.features.length; i++) {
        var feature = createElement('li', 'popup__feature', 'popup__feature--' + announcement.offer.features[i]);
        fragment.appendChild(feature);
      }

      offerFeatures.innerHTML = '';
      offerFeatures.appendChild(fragment);
    } else {
      offerFeatures.remove();
    }

    // description
    var offerDescription = cardElement.querySelector('.popup__description');

    if (announcement.offer.description.length > 0) {
      offerDescription.textContent = announcement.offer.description;
    } else {
      offerDescription.remove();
    }

    // photos
    var offerPhotos = cardElement.querySelector('.popup__photos');
    var offerPhoto = offerPhotos.querySelector('.popup__photo');

    if (announcement.offer.photos.length > 0) {
      for (var j = 0; j < announcement.offer.photos.length; j++) {
        var photo = offerPhoto.cloneNode(false);

        photo.src = announcement.offer.photos[j];
        fragment.appendChild(photo);
      }

      offerPhotos.innerHTML = '';
      offerPhotos.appendChild(fragment);
    } else {
      offerPhotos.remove();
    }

    // avatar
    cardElement.querySelector('.popup__avatar').src = announcement.author.avatar;

    announcementCard = cardElement;
    map.insertBefore(cardElement, mapFiltersContainer);
  };

  var openCard = function (announcement) {
    createUniqueAnnouncementCard(announcement);

    var cardCLoseButton = document.querySelector('.popup__close');

    document.addEventListener('keydown', openedCardEscPressHandler);

    cardCLoseButton.addEventListener('click', function () {
      closeCard();
    });
  };

  var closeCard = function () {
    if (announcementCard) {
      announcementCard.remove();
      announcementCard = null;
    }

    document.removeEventListener('keydown', openedCardEscPressHandler);
  };

  var getAnnouncementCard = function () {
    return announcementCard;
  };

  var openedCardEscPressHandler = function (evt) {
    if (window.util.isEscapeEvent(evt)) {
      evt.preventDefault();
      closeCard();
    }
  };

  return {
    createUniqueAnnouncementCard: createUniqueAnnouncementCard,
    openCard: openCard,
    closeCard: closeCard,
    getAnnouncementCard: getAnnouncementCard
  };
})();
