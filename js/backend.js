'use strict';

window.backend = (function () {
  var TIMEOUT_IN_MS = 10000;

  var URLs = {
    URL_LOAD: 'https://javascript.pages.academy/keksobooking/data'
  };

  var StatusCodes = {
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
        case StatusCodes.OK:
          onSucess(xhr.response);
          break;

        case StatusCodes.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case StatusCodes.NOT_FOUND:
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
      onError('Произошла ошибка запроса'); // обработать случай получения не json
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;
    return xhr;
  };

  var loadData = function (onSuccess, onError) {
    var xhr = makeRequest(onSuccess, onError);
    xhr.open('GET', URLs.URL_LOAD);
    xhr.send();
    return xhr;
  };

  return {
    loadData: loadData
  };
})();
