'use strict';

window.backend = (function () {
  var TIMEOUT_IN_MS = 10000;

  var Url = {
    LOAD: 'https://javascript.pages.academy/keksobooking/data',
    SAVE: 'https://javascript.pages.academy/keksobooking'
  };

  var StatusCode = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404
  };

  var makeRequest = function (onSucess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case StatusCode.OK:
          onSucess(xhr.response);
          break;

        case StatusCode.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case StatusCode.NOT_FOUND:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка запроса');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;
    return xhr;
  };

  var loadData = function (onSuccess, onError) {
    var xhr = makeRequest(onSuccess, onError);
    xhr.open('GET', Url.LOAD);
    xhr.send();
  };

  var saveData = function (onSuccess, onError, data) {
    var xhr = makeRequest(onSuccess, onError);
    xhr.open('POST', Url.SAVE);
    xhr.send(data);
  };

  return {
    loadData: loadData,
    saveData: saveData
  };
})();
