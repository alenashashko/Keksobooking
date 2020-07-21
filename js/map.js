'use strict';

window.map = (function () {
  var mainPin = document.querySelector('.map__pin--main');

  var addHandlersToMainPin = function () {
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinEnterPressHandler);
  };

  var removeHandlersFromMainPin = function () {
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
  };

  var mainPinMousedownHandler = function (evt) {
    if (window.util.isMouseLeftButtonEvent(evt)) {
      window.page.setActivePageStatus();
      removeHandlersFromMainPin();
    }
  };

  var mainPinEnterPressHandler = function (evt) {
    if (window.util.isEnterEvent(evt)) {
      window.page.setActivePageStatus();
      removeHandlersFromMainPin();
    }
  };

  return {
    addHandlersToMainPin: addHandlersToMainPin
  };
})();
