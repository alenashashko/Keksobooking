'use strict';

(function () {
  var windowLoadHandler = function () {
    window.page.setInactivePageStatus();
    window.form.validateMinPrice();
    window.form.validateGuestsQuantity();
  };

  window.addEventListener('load', windowLoadHandler);
})();
