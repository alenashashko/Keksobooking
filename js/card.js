'use strict';

window.card = (function () {
  var map = document.querySelector('.map');
  var announcementCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');
  var mapFiltersContainerElement = document.querySelector('.map__filters-container');
  var announcementCard;

  var accommodationTypeListMap = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var createElement = function (tagName) {
    var classNames = Array.prototype.slice.call(arguments, 1);
    var element = document.createElement(tagName);

    classNames.forEach(function (it) {
      element.classList.add(it);
    });

    return element;
  };

  var createUniqueAnnouncementCard = function (announcement) {
    var cardElement = announcementCardTemplate.cloneNode(true);

    // title, address and price
    cardElement.querySelector('.popup__title').textContent = announcement.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = announcement.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = announcement.offer.price
      + '₽/ночь';

    // type of accommodation
    var offerType = accommodationTypeListMap[announcement.offer.type];

    cardElement.querySelector('.popup__type').textContent = offerType;

    // number of guests and rooms
    cardElement.querySelector('.popup__text--capacity')
      .textContent = announcement.offer.rooms + ' комнаты для ' + announcement.offer.guests
        + ' гостей';

    // check-in and check-out time
    cardElement.querySelector('.popup__text--time')
      .textContent = 'Заезд после ' + announcement.offer.checkin + ', выезд до '
        + announcement.offer.checkout;

    // features
    var offerFeaturesContainerElement = cardElement.querySelector('.popup__features');
    var fragment = document.createDocumentFragment();
    var features = announcement.offer.features;

    if (features.length > 0) {
      features.forEach(function (it) {
        var feature = createElement('li', 'popup__feature', 'popup__feature--' + it);
        fragment.appendChild(feature);
      });

      offerFeaturesContainerElement.innerHTML = '';
      offerFeaturesContainerElement.appendChild(fragment);
    } else {
      offerFeaturesContainerElement.remove();
    }

    // description
    var offerDescriptionContainerElement = cardElement.querySelector('.popup__description');

    if (announcement.offer.description.length > 0) {
      offerDescriptionContainerElement.textContent = announcement.offer.description;
    } else {
      offerDescriptionContainerElement.remove();
    }

    // photos
    var offerPhotosContainerElement = cardElement.querySelector('.popup__photos');
    var offerPhoto = offerPhotosContainerElement.querySelector('.popup__photo');

    if (announcement.offer.photos.length > 0) {
      for (var j = 0; j < announcement.offer.photos.length; j++) {
        var photo = offerPhoto.cloneNode(false);

        photo.src = announcement.offer.photos[j];
        fragment.appendChild(photo);
      }

      offerPhotosContainerElement.innerHTML = '';
      offerPhotosContainerElement.appendChild(fragment);
    } else {
      offerPhotosContainerElement.remove();
    }

    // avatar
    cardElement.querySelector('.popup__avatar').src = announcement.author.avatar;

    announcementCard = cardElement;
    map.insertBefore(cardElement, mapFiltersContainerElement);
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

  var getAnnouncementCard = function () { // return current state
    return announcementCard;
  };

  var openedCardEscPressHandler = function (evt) {
    if (window.util.isEscapeEvent(evt)) {
      evt.preventDefault();
      closeCard();
    }
  };

  return {
    create: createUniqueAnnouncementCard,
    open: openCard,
    close: closeCard,
    get: getAnnouncementCard
  };
})();
