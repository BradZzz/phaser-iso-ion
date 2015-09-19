angular.module('blast').service('auth', function ($window, $rootScope) {
  this.init = function() {
    if ($window.sessionStorage["auth"]) {
      $rootScope.auth = $window.sessionStorage["auth"]
    }
  }
  this.init()
});
