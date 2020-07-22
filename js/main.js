'use strict';

(function () {
  var windowLoadHandler = function () {
    window.page.setInactiveStatus();
    window.form.validateMinPrice();
    window.form.validateGuestsQuantity();
    window.loadFiles.accommodationPhotoChooser.setAttribute('multiple', '');
  };

  window.addEventListener('load', windowLoadHandler);
})();
