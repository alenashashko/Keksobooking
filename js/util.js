'use strict';

window.util = (function () {
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

  var getdataFromArray = function (array, result) {
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

  return {
    getRandomNumber: getRandomNumber,
    getdataFromArray: getdataFromArray
  };
})();
