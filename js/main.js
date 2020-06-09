'use strict';

var ANNOUNCEMENTS_AMOUNT = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_AND_CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner',
  'description'];
var CHARACTERISTICS = ['красивые', 'виды', 'уютные', 'комнаты', 'удобные', 'чистые', 'просторные', 'апартаменты',
  'прекрасные', 'атмосферные', 'удобства', 'недорогие', 'новые'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MAP_PIN_HEIGHT = 84; // ?

var map = document.querySelector('.map');
var mapOverlay = document.querySelector('.map__overlay');
var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
var mapPinImage = mapPinTemplate.querySelector('img');
var mapPinsList = document.querySelector('.map__pins');


var init = function () {
  map.classList.remove('map--faded'); // временное решение
  drawMapPins();
};

var getRandomNumber = function (minRandomNumber, maxRandomNumber) {
  var randomNumber = Math.round(minRandomNumber + Math.random() * (maxRandomNumber - minRandomNumber));
  return randomNumber;
};

var getRandomDataFromArray = function (array, result) {
  var randomArray = array.slice().sort(function () {
    return getRandomNumber(0, 1) - 0.5;
  });
  if (result === 'array') {
    var i = getRandomNumber(0, randomArray.length - 1);
    randomArray.splice(i); // допускается, что в новом массиве вообще не останется значений
    return randomArray;
  } else if (result === 'string') {
    var string = '';
    // на i ругается eslint как на уже существующую переменную, поэтому название переменной - j
    for (var j = 0; j <= getRandomNumber(0, randomArray.length - 1); j++) {
      string += ' ' + randomArray[j]; // убрать пустую строку
    }
    return string;
  } else {
    return null;
  }
};

var getRandomAnnouncement = function (i) {
  var addressObject = {
    'x': getRandomNumber(0, mapOverlay.offsetWidth - (mapPinTemplate.offsetWidth / 2)),
    // check
    'y': getRandomNumber(130, 630)
  };
  var announcement = {
    'author': {
      'avatar': 'img/avatars/user0' + (i + 1) + '.png'
    },
    'offer': {
      'title': getRandomDataFromArray(CHARACTERISTICS, 'string'),
      'address': addressObject['x'] + ', ' + addressObject['y'],
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
  console.log(announcement.location.x, mapPinTemplate.offsetWidth);
  pinElement.style.left = (announcement.location.x - (mapPinTemplate.offsetWidth / 2)) + 'px'; // ?
  console.log(pinElement.style.left);
  pinElement.style.top = announcement.location.y - pinElement.offsetHeight + 'px'; // ?
  // console.log(pinElement.offsetHeight);
  mapPinImage.src = announcement.author.avatar;
  mapPinImage.alt = announcement.offer.title;
  return pinElement;
};

var drawMapPins = function () {
  var fragment = document.createDocumentFragment();
  var announcements = getAnnouncements();
  console.log(announcements);
  for (var i = 0; i < announcements.length; i++) {
    var uniqueMapPin = getUniqueMapPin(announcements[i]);
    fragment.appendChild(uniqueMapPin);
  }
  mapPinsList.appendChild(fragment);
};

init();
