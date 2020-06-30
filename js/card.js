'use strict';

window.card = (function () {
  var typesOfAccommodation = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var map = document.querySelector('.map');
  var announcementCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var announcementCard;

  var createElement = function (tagName) {
    var classNames = Array.prototype.slice.call(arguments, [0, 1]);
    var element = document.createElement(tagName);
    for (var i = 0; i < classNames.length; i++) {
      element.classList.add(classNames[i]);
    }
    return element;
  };

  var createUniqueAnnouncementCard = function (announcement) {
    var cardElement = announcementCardTemplate.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = announcement.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = announcement.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = announcement.offer.price + '₽/ночь';

    var offerType = typesOfAccommodation[announcement.offer.type];
    cardElement.querySelector('.popup__type').textContent = offerType;

    cardElement.querySelector('.popup__text--capacity')
      .textContent = announcement.offer.rooms + ' комнаты для ' + announcement.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time')
      .textContent = 'Заезд после ' + announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout;

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

    var offerDescription = cardElement.querySelector('.popup__description');
    if (announcement.offer.description.length > 0) { // после прихода данных с сервера посм, может ли не быть описания в карточке
      offerDescription.textContent = announcement.offer.description;
    } else {
      offerDescription.remove();
    }

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

    cardElement.querySelector('.popup__avatar').src = announcement.author.avatar;

    announcementCard = cardElement;
    map.insertBefore(cardElement, mapFiltersContainer);
  };

  var getAnnouncementCard = function () {
    return announcementCard;
  };

  var setEmptyAnnouncementCard = function () {
    announcementCard = null;
  };

  return {
    createUniqueAnnouncementCard: createUniqueAnnouncementCard,
    getAnnouncementCard: getAnnouncementCard,
    removeAnnouncementCard: setEmptyAnnouncementCard
  };

})();
