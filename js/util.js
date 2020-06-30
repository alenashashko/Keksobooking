'use strict';

window.util = (function () {
  var EventKeyCode = {
    ENTER: 'Enter',
    ESCAPE: 'Escape'
  };

  var MOUSE_LEFT_BUTTON = 0;

  var isEnterEvent = function (evt) {
    return evt.key === EventKeyCode.ENTER;
  };

  var isEscapeEvent = function (evt) {
    return evt.key === EventKeyCode.ESCAPE;
  };

  var isMouseLeftButtonEvent = function (evt) {
    return evt.button === MOUSE_LEFT_BUTTON;
  };

  return {
    isEnterEvent: isEnterEvent,
    isEscapeEvent: isEscapeEvent,
    isMouseLeftButtonEvent: isMouseLeftButtonEvent
  };
})();
