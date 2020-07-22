'use strict';

window.loadFiles = (function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];
  var AVATAR_SRC_DEFAULT = 'img/muffin-grey.svg';

  var avatarChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var accommodationPhotoChooser = document.querySelector('#images');
  var accommodationPhotoContainerElement = document.querySelector('.ad-form__photo');

  var isFileTypeMatches = function (file) {
    var fileName = file.name.toLowerCase();

    var isMatching = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    return isMatching;
  };

  var deleteAvatar = function () {
    avatarPreview.src = AVATAR_SRC_DEFAULT;
  };

  var deleteAccommodationPhoto = function () {
    var photo = accommodationPhotoContainerElement.querySelector('img');

    if (photo) {
      photo.remove();
    }
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
    var accommodationPhoto = accommodationPhotoChooser.files[0];

    if (isFileTypeMatches(accommodationPhoto)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var photo = document.createElement('img');

        photo.src = reader.result;
        photo.style.width = '100%';
        photo.style.height = '100%';

        accommodationPhotoContainerElement.appendChild(photo);
      });

      reader.readAsDataURL(accommodationPhoto);
    }
  });

  return {
    deleteAvatar: deleteAvatar,
    deleteAccommodationPhoto: deleteAccommodationPhoto
  };
})();
