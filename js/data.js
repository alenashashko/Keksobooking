'use strict';

window.data = (function () {
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

  var TYPES = Object.keys(typesOfAccommodation);

  var mapOverlay = document.querySelector('.map__overlay');

  var getRandomAnnouncement = function (i) {
    var address = {
      'x': window.randomData.getRandomNumber(0, mapOverlay.offsetWidth),
      'y': window.randomData.getRandomNumber(130, 630)
    };
    var announcement = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': window.randomData.getRandomDataFromArray(CHARACTERISTICS, 'string'),
        'address': address.x + ', ' + address.y,
        'price': window.randomData.getRandomNumber(1, 1000000),
        'type': TYPES[window.randomData.getRandomNumber(0, 3)],
        'rooms': window.randomData.getRandomNumber(1, 3),
        'guests': window.randomData.getRandomNumber(1, 3),
        'checkin': CHECKIN_AND_CHECKOUT_TIME[window.randomData.getRandomNumber(0, 2)],
        'checkout': CHECKIN_AND_CHECKOUT_TIME[window.randomData.getRandomNumber(0, 2)],
        'features': window.randomData.getRandomDataFromArray(FEATURES, 'array'),
        'description': window.randomData.getRandomDataFromArray(CHARACTERISTICS, 'string'),
        'photos': window.randomData.getRandomDataFromArray(PHOTOS, 'array'),
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

  return {
    getAnnouncementsArray: getAnnouncementsArray
  };
})();
