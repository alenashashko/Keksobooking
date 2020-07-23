'use strict';

window.card = (function () {
  var map = document.querySelector('.map');
  var announcementCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
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
    var cardContainer = announcementCardTemplate.cloneNode(true);

    // title, address and price
    cardContainer.querySelector('.popup__title').textContent = announcement.offer.title;
    cardContainer.querySelector('.popup__text--address').textContent = announcement.offer.address;
    cardContainer.querySelector('.popup__text--price').textContent = announcement.offer.price
      + '₽/ночь';

    // type of accommodation
    var offerType = accommodationTypeListMap[announcement.offer.type];

    cardContainer.querySelector('.popup__type').textContent = offerType;

    // number of guests and rooms
    cardContainer.querySelector('.popup__text--capacity')
      .textContent = announcement.offer.rooms + ' комнаты для ' + announcement.offer.guests
        + ' гостей';

    // check-in and check-out time
    cardContainer.querySelector('.popup__text--time')
      .textContent = 'Заезд после ' + announcement.offer.checkin + ', выезд до '
        + announcement.offer.checkout;

    // features
    var offerFeaturesContainer = cardContainer.querySelector('.popup__features');
    var fragment = document.createDocumentFragment();
    var features = announcement.offer.features;

    if (features.length > 0) {
      features.forEach(function (it) {
        var feature = createElement('li', 'popup__feature', 'popup__feature--' + it);
        fragment.appendChild(feature);
      });

      offerFeaturesContainer.innerHTML = '';
      offerFeaturesContainer.appendChild(fragment);
    } else {
      offerFeaturesContainer.remove();
    }

    // description
    var offerDescriptionContainer = cardContainer.querySelector('.popup__description');

    if (announcement.offer.description.length > 0) {
      offerDescriptionContainer.textContent = announcement.offer.description;
    } else {
      offerDescriptionContainer.remove();
    }

    // photos
    var offerPhotosContainer = cardContainer.querySelector('.popup__photos');
    var offerPhoto = offerPhotosContainer.querySelector('.popup__photo');

    if (announcement.offer.photos.length > 0) {
      for (var j = 0; j < announcement.offer.photos.length; j++) {
        var photo = offerPhoto.cloneNode(false);

        photo.src = announcement.offer.photos[j];
        fragment.appendChild(photo);
      }

      offerPhotosContainer.innerHTML = '';
      offerPhotosContainer.appendChild(fragment);
    } else {
      offerPhotosContainer.remove();
    }

    // avatar
    cardContainer.querySelector('.popup__avatar').src = announcement.author.avatar;

    announcementCard = cardContainer;
    map.insertBefore(cardContainer, mapFiltersContainer);
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
    if (window.pins.active()) {
      window.pins.active().classList.remove('map__pin--active');
      window.pins.clearActive();
    }
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
