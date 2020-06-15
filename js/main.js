'use strict';

// константы и перечисления

var ANNOUNCEMENTS_AMOUNT = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_AND_CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var CHARACTERISTICS = ['красивые', 'виды', 'уютные', 'комнаты', 'удобные', 'чистые', 'просторные', 'апартаменты',
  'прекрасные', 'атмосферные', 'удобства', 'недорогие', 'новые'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var MapPinSizes = {
  width: 50,
  height: 70
};

// переменные

var map = document.querySelector('.map');
var mapOverlay = document.querySelector('.map__overlay');
var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
var mapPinsList = document.querySelector('.map__pins');
var announcementForm = document.querySelector('.ad-form');
var announcementFormFieldsets = announcementForm.querySelectorAll('fieldset');
var mapFiltersForm = document.querySelector('.map__filters');
var mapFilters = mapFiltersForm.children;
var mapPinControl = document.querySelector('.map__pin--main');

// объявления функций

var init = function () {
  drawMapPins();
};

var getRandomNumber = function (minRandomNumber, maxRandomNumber) {
  var randomNumber = Math.round(minRandomNumber + Math.random() * (maxRandomNumber - minRandomNumber));
  return randomNumber;
};

var getShuffledArray = function (array) {
  var randomArray = array.slice(); // можно ли называть одинаково разные локальные переменные?
  for (var i = randomArray.length - 1; i > 0; i--) {
    var j = getRandomNumber(0, i);
    var swap = randomArray[i];
    randomArray[i] = randomArray[j];
    randomArray[j] = swap;
  }
  return randomArray;
};

var getRandomDataFromArray = function (array, result) {
  var randomArray = getShuffledArray(array); // можно ли называть одинаково разные локальные переменные?
  if (result === 'array') {
    var i = getRandomNumber(1, randomArray.length - 1);
    randomArray.splice(i);
    return randomArray;
  } else if (result === 'string') {
    return randomArray.slice(0, getRandomNumber(0, randomArray.length - 1)).join(' ');
  } else {
    return null;
  }
};

var getDisabledElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
  return elements;

  // for (var field of announcementFormFields) {
  //   field.disabled = true;
  // };
};

var getActiveElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
  return elements;
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

var getAnnouncements = function () {
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

var drawMapPins = function () {
  var fragment = document.createDocumentFragment();
  var announcements = getAnnouncements();
  for (var i = 0; i < announcements.length; i++) {
    var uniqueMapPin = getUniqueMapPin(announcements[i]);
    fragment.appendChild(uniqueMapPin);
  }
  mapPinsList.appendChild(fragment);
};

// вызовы функций

init();

getDisabledElements(announcementFormFieldsets);
getDisabledElements(mapFiltersForm); // ?
getDisabledElements(mapFilters);

mapPinControl.addEventListener('mousedown', function (evt) { // отмена изменений (disabled)
  if (evt.button === 0) {
    map.classList.remove('map--faded');
    announcementForm.classList.remove('ad-form--disabled');
    getActiveElements(announcementFormFieldsets);
    getActiveElements(mapFiltersForm);
    getActiveElements(mapFilters);
  }
});
