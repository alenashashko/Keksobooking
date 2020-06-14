'use strict';

var ANNOUNCEMENTS_AMOUNT = 8;
var CHECKIN_AND_CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var CHARACTERISTICS = ['красивые', 'виды', 'уютные', 'комнаты', 'удобные', 'чистые', 'просторные', 'апартаменты',
  'прекрасные', 'атмосферные', 'удобства', 'недорогие', 'новые'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var TypesOfAccommodation = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var TYPES = Object.keys(TypesOfAccommodation);

var MapPinSizes = {
  width: 50,
  height: 70
};

var map = document.querySelector('.map');
var mapOverlay = document.querySelector('.map__overlay');
var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
var mapPinsList = document.querySelector('.map__pins');
var announcementCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
var mapFilters = document.querySelector('.map__filters-container');


var init = function () {
  var announcements = getAnnouncementsArray();

  map.classList.remove('map--faded'); // временное решение
  drawMapPins(announcements);
  drawAnnouncementCard(announcements);
};

var getRandomNumber = function (minRandomNumber, maxRandomNumber) {
  var randomNumber = Math.round(minRandomNumber + Math.random() * (maxRandomNumber - minRandomNumber));
  return randomNumber;
};

var getShuffledArray = function (array) {
  var randomArray = array.slice();
  for (var i = randomArray.length - 1; i > 0; i--) {
    var j = getRandomNumber(0, i);
    var swap = randomArray[i];
    randomArray[i] = randomArray[j];
    randomArray[j] = swap;
  }
  return randomArray;
};

var getRandomDataFromArray = function (array, result) {
  var randomArray = getShuffledArray(array);
  if (result === 'array') {
    var i = getRandomNumber(1, randomArray.length);
    randomArray.splice(i);
    return randomArray;
  } else if (result === 'string') {
    return randomArray.slice(0, getRandomNumber(0, randomArray.length - 1)).join(' ');
  } else {
    return null;
  }
};

var createElement = function (tagName, firstClassName, secondClassName) {
  var element = document.createElement(tagName);
  element.classList.add(firstClassName);
  element.classList.add(secondClassName);
  return element;
};

var getRandomAnnouncement = function (i) {
  var addressObject = {
    'x': getRandomNumber(0, mapOverlay.offsetWidth),
    'y': getRandomNumber(130, 630)
  };
  var announcement = {
    'author': {
      'avatar': 'img/avatars/user0' + (i + 1) + '.png'
    },
    'offer': {
      'title': getRandomDataFromArray(CHARACTERISTICS, 'string'),
      'address': addressObject.x + ', ' + addressObject.y,
      'price': getRandomNumber(1, 1000000),
      'type': TYPES[getRandomNumber(0, 3)],
      'rooms': getRandomNumber(1, 3),
      'guests': getRandomNumber(1, 3),
      'checkin': CHECKIN_AND_CHECKOUT_TIME[getRandomNumber(0, 2)],
      'checkout': CHECKIN_AND_CHECKOUT_TIME[getRandomNumber(0, 2)],
      'features': getRandomDataFromArray(FEATURES, 'array'),
      'description': getRandomDataFromArray(CHARACTERISTICS, 'string'),
      'photos': getRandomDataFromArray(PHOTOS, 'array'),
    },
    'location': addressObject
  };
  return announcement;
};

var getAnnouncementsArray = function () {
  var announcementsArray = [];
  for (var i = 0; i < ANNOUNCEMENTS_AMOUNT; i++) {
    announcementsArray.push(getRandomAnnouncement(i));
  }
  return announcementsArray;
};

var getUniqueMapPin = function (announcement) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style.left = announcement.location.x - MapPinSizes.width / 2 + 'px';
  pinElement.style.top = announcement.location.y - MapPinSizes.height + 'px';

  var mapPinImage = pinElement.querySelector('img');
  mapPinImage.src = announcement.author.avatar;
  mapPinImage.alt = announcement.offer.title;
  return pinElement;
};

var drawMapPins = function (announcements) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < announcements.length; i++) {
    var uniqueMapPin = getUniqueMapPin(announcements[i]);
    fragment.appendChild(uniqueMapPin);
  }
  mapPinsList.appendChild(fragment);
};

var getUniqueAnnouncementCard = function (announcement) {
  var cardElement = announcementCardTemplate.cloneNode(true);
  // нужно ли для querySelector'ов заводить отдельные переменные?
  cardElement.querySelector('.popup__title').textContent = announcement.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = announcement.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = announcement.offer.price + '₽/ночь';

  var offerType = TypesOfAccommodation[announcement.offer.type];
  cardElement.querySelector('.popup__type').textContent = offerType;

  cardElement.querySelector('.popup__text--capacity')
    .textContent = announcement.offer.rooms + ' комнаты для ' + announcement.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time')
    .textContent = 'Заезд после ' + announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout;

  var offerFeatures = cardElement.querySelector('.popup__features');
  offerFeatures.innerHTML = ''; // ?
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < announcement.offer.features.length; i++) { // ?
    var feature = createElement('li', 'popup__feature', 'popup__feature--' + announcement.offer.features[i]);
    fragment.appendChild(feature);
  }
  offerFeatures.appendChild(fragment);

  cardElement.querySelector('.popup__description').textContent = announcement.offer.description;

  var offerPhotos = cardElement.querySelector('.popup__photos');
  var offerPhoto = offerPhotos.querySelector('.popup__photo');
  offerPhotos.innerHTML = '';
  for (var j = 0; j < announcement.offer.photos.length; j++) {
    var photo = createElement('img', 'popup__photo');
    photo.src = announcement.offer.photos[j];
    photo.width = offerPhoto.width;
    photo.height = offerPhoto.height;
    fragment.appendChild(photo);
  }
  offerPhotos.appendChild(fragment);

  cardElement.querySelector('.popup__avatar').src = announcement.author.avatar;

  return cardElement;
};

var drawAnnouncementCard = function (announcements) {
  var card = getUniqueAnnouncementCard(announcements[0]);
  map.insertBefore(card, mapFilters);
};

init();

// Если данных для заполнения не хватает, соответствующий блок в карточке скрывается.
