angular.module('blast').service('auth', function ($window, $rootScope) {
  this.init = function() {
    if ($window.sessionStorage["auth"]) {
      $rootScope.auth = JSON.parse($window.sessionStorage["auth"])
    }
  }
  this.init()
});
