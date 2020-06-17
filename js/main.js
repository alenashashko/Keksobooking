'use strict';

// константы и перечисления

var ANNOUNCEMENTS_AMOUNT = 8;
var CHECKIN_AND_CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var CHARACTERISTICS = ['красивые', 'виды', 'уютные', 'комнаты', 'удобные', 'чистые', 'просторные', 'апартаменты',
  'прекрасные', 'атмосферные', 'удобства', 'недорогие', 'новые'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var typesOfAccommodation = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var minPricesOfAccommodation = {
  'palace': '10000',
  'flat': '1000',
  'house': '5000',
  'bungalo': '0'
};

var TYPES = Object.keys(typesOfAccommodation);

var MapPinControlSizes = { // перепроверить
  WIDTH: 65,
  HEIGHT: 84
};

var MapPinSizes = {
  WIDTH: 50,
  HEIGHT: 70
};

// переменные

var map = document.querySelector('.map');
var mapOverlay = document.querySelector('.map__overlay');
var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
var mapPinsList = document.querySelector('.map__pins');
var announcementCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var announcementForm = document.querySelector('.ad-form');
var announcementFormFieldsets = announcementForm.querySelectorAll('fieldset');
var mapFiltersForm = document.querySelector('.map__filters');
var mapFilters = mapFiltersForm.children;
var mapPinControl = document.querySelector('.map__pin--main');
var addressInput = document.querySelector('input[name="address"]');
var typeOfAccommodation = document.querySelector('#type');
var priceOfAccommodation = document.querySelector('#price');

// объявления функций

var init = function () {
  var announcements = getAnnouncementsArray();

  mapPinControl.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      setActivePageStatus();
    }
  });

  mapPinControl.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      setActivePageStatus();
    }
  });

  setInactivePageStatus();
  drawMapPins(announcements);
  createUniqueAnnouncementCard(announcements[0]);

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
    randomArray.splice(0, i);
    return randomArray;
  } else if (result === 'string') {
    return randomArray.slice(0, getRandomNumber(0, randomArray.length - 1)).join(' ');
  } else {
    return null;
  }
};

var setDisabledElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
};

var setActiveElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
};

var setAddressValue = function (pageStatus) {
  var mapPinControlLeftCoordinate = parseInt(mapPinControl.style.left, 10);
  var mapPinControlTopCoordinate = parseInt(mapPinControl.style.top, 10);
  var additionToLeftCoordinate = MapPinControlSizes.WIDTH / 2;
  var additionToTopCoordinate = (pageStatus === 'active') ? MapPinControlSizes.HEIGHT : MapPinControlSizes.HEIGHT / 2;
  addressInput.value = Math.round(mapPinControlLeftCoordinate + additionToLeftCoordinate) + ', ' +
  Math.round(mapPinControlTopCoordinate + additionToTopCoordinate); // центра метки либо центра кружка метки?
};

var setInactivePageStatus = function () { // setAddressValue('inactive'); вынести из этой функции в init?
  setDisabledElements(announcementFormFieldsets);
  setDisabledElements(mapFilters);
  setAddressValue('inactive');
};

var setActivePageStatus = function () {
  map.classList.remove('map--faded');
  announcementForm.classList.remove('ad-form--disabled');
  setActiveElements(announcementFormFieldsets);
  setActiveElements(mapFilters);
  setAddressValue('active'); // setAddressValue('active'); вынести из этой функции в обработчики клика и нажатия enter?
};

var createElement = function (tagName) { // назвать с get обязательно, если возвращает значение? getNewElement
  var classNames = Array.prototype.slice.call(arguments, [0, 1]);
  var element = document.createElement(tagName);
  for (var i = 0; i < classNames.length; i++) {
    element.classList.add(classNames[i]);
  }
  return element;
};

var getRandomAnnouncement = function (i) {
  var address = {
    'x': getRandomNumber(0, mapOverlay.offsetWidth),
    'y': getRandomNumber(130, 630)
  };
  var announcement = {
    'author': {
      'avatar': 'img/avatars/user0' + (i + 1) + '.png'
    },
    'offer': {
      'title': getRandomDataFromArray(CHARACTERISTICS, 'string'),
      'address': address.x + ', ' + address.y,
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
    'location': address
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
  pinElement.style.left = announcement.location.x - MapPinSizes.WIDTH / 2 + 'px';
  pinElement.style.top = announcement.location.y - MapPinSizes.HEIGHT + 'px';

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
  for (var i = 0; i < announcement.offer.features.length; i++) {
    var feature = createElement('li', 'popup__feature', 'popup__feature--' + announcement.offer.features[i]);
    fragment.appendChild(feature);
  }
  offerFeatures.innerHTML = '';
  offerFeatures.appendChild(fragment);

  cardElement.querySelector('.popup__description').textContent = announcement.offer.description;

  var offerPhotos = cardElement.querySelector('.popup__photos');
  var offerPhoto = offerPhotos.querySelector('.popup__photo');
  for (var j = 0; j < announcement.offer.photos.length; j++) {
    var photo = offerPhoto.cloneNode(false);
    photo.src = announcement.offer.photos[j];
    fragment.appendChild(photo);
  }
  offerPhotos.innerHTML = '';
  offerPhotos.appendChild(fragment);

  cardElement.querySelector('.popup__avatar').src = announcement.author.avatar;

  map.insertBefore(cardElement, mapFiltersContainer);
};

// объявления обработчиков

var windowLoadHandler = function () {
  init();
};

// событие загрузки страницы - код вне функций

window.addEventListener('load', windowLoadHandler);

typeOfAccommodation.addEventListener('change', function() {
  priceOfAccommodation.min = minPricesOfAccommodation[typeOfAccommodation.value];
});

// for (var field of announcementFormFieldsets) {
//   console.log(field);
// }; не работает

// Если данных для заполнения не хватает, соответствующий блок в карточке скрывается: проверять длину элементов,
//   напр. announcement.offer.photo.length и если > 0, то рисую, а если нет, то remove

// var hideEmptyCardBlocks = function (announcement) {
//   if (announcement.author.avatar.length === 0) {
//     announcement.author.avatar
//   }
// };

// accept="image/png, image/jpeg" нужен для аватара и фото жилья?
