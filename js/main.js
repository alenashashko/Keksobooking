'use strict';

(function () {
  var windowLoadHandler = function () {
    window.page.setInactivePageStatus();
    window.form.validateMinPrice();
    window.form.validateGuestsCount();
  };

  window.addEventListener('load', windowLoadHandler);
})();
