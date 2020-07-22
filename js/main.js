'use strict';

(function () {
  var windowLoadHandler = function () {
    window.page.setInactiveStatus();
    window.form.validateMinPrice();
    window.form.validateGuestsQuantity();
  };

  window.addEventListener('load', windowLoadHandler);
})();
