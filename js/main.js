'use strict';

// константы и перечисления

var ANNOUNCEMENTS_AMOUNT = 8;
var CHECKIN_AND_CHECKOUT_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var CHARACTERISTICS = ['красивые', 'виды', 'уютные', 'комнаты', 'удобные', 'чистые', 'просторные', 'апартаменты',
  'прекрасные', 'атмосферные', 'удобства', 'недорогие', 'новые'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MOUSE_LEFT_BUTTON = 0;

var typesOfAccommodation = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var TYPES = Object.keys(typesOfAccommodation);

var minPricesOfAccommodation = {
  'palace': '10000',
  'flat': '1000',
  'house': '5000',
  'bungalo': '0'
};

var MapPinControlSizes = {
  WIDTH: 65,
  HEIGHT: 62,
  POINTER_HEIGHT: 22
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
var addressInput = document.querySelector('#address');
var typeOfAccommodation = document.querySelector('#type');
var priceOfAccommodation = document.querySelector('#price');
var numberOfRooms = document.querySelector('#room_number');
var numberOfGuests = document.querySelector('#capacity');
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');
var announcementFormReset = document.querySelector('.ad-form__reset');

// объявления функций

var init = function () {
  var announcements = getAnnouncementsArray();

  mapPinControl.addEventListener('mousedown', mapPinControlMouseDownHandler);
  mapPinControl.addEventListener('keydown', mapPinControlEnterPressHandler);
  typeOfAccommodation.addEventListener('change', typeOfAccommodationChangeHandler);
  numberOfGuests.addEventListener('change', numberOfGuestsChangeHandler);
  numberOfRooms.addEventListener('change', numberOfRoomsChangeHandler);
  timeIn.addEventListener('change', timeInChangeHandler);
  timeOut.addEventListener('change', timeOutChangeHandler);
  announcementFormReset.addEventListener('click', announcementFormResetClickHandler);

  drawMapPins(announcements);
  toggleActivePageStatus('inactive');
  validateMinPrice();
  validateGuestsCount();
};

var getRandomNumber = function (minRandomNumber, maxRandomNumber) {
  var randomNumber = Math.floor(minRandomNumber + Math.random() * (maxRandomNumber - minRandomNumber + 1));
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

var toggleDisabledElementsAttribute = function (elements, isDisabled) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = isDisabled;
  }
};

var toggleDisplayElementsProperty = function (elements, isDisplayed) {
  var displayValue = (isDisplayed) ? 'block' : 'none';
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = displayValue;
  }
};

var setAddressValue = function (pageStatus) {
  var mapPinControlLeftCoordinate = parseInt(mapPinControl.style.left, 10);
  var mapPinControlTopCoordinate = parseInt(mapPinControl.style.top, 10);
  var additionToLeftCoordinate = MapPinControlSizes.WIDTH / 2;
  var additionToTopCoordinate = (pageStatus === 'active') ? (MapPinControlSizes.HEIGHT + MapPinControlSizes.POINTER_HEIGHT) :
    MapPinControlSizes.HEIGHT / 2;
  addressInput.value = Math.round(mapPinControlLeftCoordinate + additionToLeftCoordinate) + ', ' +
  Math.round(mapPinControlTopCoordinate + additionToTopCoordinate);
};

var toggleActivePageStatus = function (pagestatus) {
  // нужна помощь в упрощении функции. Возможно, стоит все же сделать 2 разные функции: setActivePageStatus и setInactivePageStatus
  setAddressValue(pagestatus);
  var mapPins = mapPinsList.querySelectorAll('.map__pin');
  var mapAnnouncementPins = Array.prototype.slice.call(mapPins, [1]);
  var announcementCard = document.querySelector('.map__card');

  if (pagestatus === 'active') {
    toggleDisplayElementsProperty(mapAnnouncementPins, true);
    map.classList.remove('map--faded');
    announcementForm.classList.remove('ad-form--disabled');
    toggleDisabledElementsAttribute(announcementFormFieldsets, false);
    toggleDisabledElementsAttribute(mapFilters, false);
  } else {
    toggleDisplayElementsProperty(mapAnnouncementPins, false);
    if (announcementCard) { 
      closeCard();
    }
    map.classList.add('map--faded');
    announcementForm.classList.add('ad-form--disabled');
    toggleDisabledElementsAttribute(announcementFormFieldsets, true);
    toggleDisabledElementsAttribute(mapFilters, true);
  }
};

var createElement = function (tagName) {
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

var pinClickListenerCreator = function (element, announcement) {  //можно так назвать функцию?
  element.addEventListener('click', function () {
    var openedCards = document.querySelectorAll('.map__card');
    for (var i = 0; i < openedCards.length; i++) {
      openedCards[i].remove();
    }
    openCard(announcement);
  })
}

var drawMapPins = function (announcements) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < announcements.length; i++) {
    var uniqueMapPin = getUniqueMapPin(announcements[i]);
    pinClickListenerCreator(uniqueMapPin, announcements[i]);
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

  map.insertBefore(cardElement, mapFiltersContainer);
};

var openCard = function (announcement) {
  createUniqueAnnouncementCard(announcement);
  document.addEventListener('keydown', openedCardEscPressHandler)
  var cardCLoseButton = document.querySelector('.popup__close');
  cardCLoseButton.addEventListener('click', function() {
    closeCard();
  });
};

var closeCard = function () {
var openedCard = document.querySelector('.map__card');
openedCard.remove();

document.removeEventListener('keydown', openedCardEscPressHandler)
};

var validateMinPrice = function () {
  priceOfAccommodation.min = priceOfAccommodation.placeholder = minPricesOfAccommodation[typeOfAccommodation.value];
};

var validateGuestsCount = function () {
  if ((+numberOfRooms.value >= +numberOfGuests.value) && +numberOfRooms.value !== 100 && +numberOfGuests.value !== 0) {
    numberOfGuests.setCustomValidity('');
  } else if (+numberOfRooms.value === 100 && +numberOfGuests.value === 0) {
    numberOfGuests.setCustomValidity('');
  } else {
    numberOfGuests.setCustomValidity('Количество комнат не соответствует количеству гостей');
  }
};

// объявления обработчиков

var windowLoadHandler = function () {
  init();
};

var mapPinControlMouseDownHandler = function (evt) {
  if (evt.button === MOUSE_LEFT_BUTTON) {
    toggleActivePageStatus('active');
  }
};

var mapPinControlEnterPressHandler = function (evt) {
  if (evt.key === 'Enter') {
    toggleActivePageStatus('active');
  }
};

var openedCardEscPressHandler = function(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeCard();
  }
}

var typeOfAccommodationChangeHandler = function () {
  validateMinPrice();
};

var numberOfGuestsChangeHandler = function () {
  validateGuestsCount();
};

var numberOfRoomsChangeHandler = function () {
  validateGuestsCount();
};

var timeInChangeHandler = function () {
  timeOut.value = timeIn.value;
};

var timeOutChangeHandler = function () {
  timeIn.value = timeOut.value;
};

var announcementFormResetClickHandler = function () {
  toggleActivePageStatus('inactive');
};

// остальной код

window.addEventListener('load', windowLoadHandler);