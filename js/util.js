'use strict';

window.util = (function () {
  var MOUSE_LEFT_BUTTON = 0;
  var DEBOUNCE_INTERVAL = 500;

  var EventKeyCode = {
    ENTER: 'Enter',
    ESCAPE: 'Escape'
  };

  var isEnterEvent = function (evt) {
    return evt.key === EventKeyCode.ENTER;
  };

  var isEscapeEvent = function (evt) {
    return evt.key === EventKeyCode.ESCAPE;
  };

  var isMouseLeftButtonEvent = function (evt) {
    return evt.button === MOUSE_LEFT_BUTTON;
  };

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;

      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  return {
    isEnterEvent: isEnterEvent,
    isEscapeEvent: isEscapeEvent,
    isMouseLeftButtonEvent: isMouseLeftButtonEvent,
    debounce: debounce
  };
})();
