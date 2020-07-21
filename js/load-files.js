'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];

  var avatarChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var accommodationPhotoChooser = document.querySelector('#images'); // + multiple
  var accommodationPhotoContainerElement = document.querySelector('.ad-form__photo');

  var isFileTypeMatches = function (file) {
    var fileName = file.name.toLowerCase();

    var isMatching = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    return isMatching;
  };

  avatarChooser.addEventListener('change', function () {
    var avatar = avatarChooser.files[0];

    if (isFileTypeMatches(avatar)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(avatar);
    }
  });

  accommodationPhotoChooser.addEventListener('change', function () {
    var photos = accommodationPhotoChooser.files;

    photos.forEach(function (it) {
      if (isFileTypeMatches(it)) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          var photo = document.createElement('img');
          photo.src = reader.result; // доп стили по необходимости

          accommodationPhotoContainerElement.appendChild(photo);
        });

        reader.readAsDataURL(it);
      }
    });
  });
})();
