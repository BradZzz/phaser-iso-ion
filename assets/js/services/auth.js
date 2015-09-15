angular.module('blast').service('auth', function ($window, $rootScope) {
  function init() {
    if ($window.sessionStorage["auth"]) {
      $rootScope.auth = JSON.parse($window.sessionStorage["auth"]);
    }
  }
  init()
});
