angular.module('blast').controller('CastHomeCtrl', function ($scope, $rootScope, $http, $window, $state, $location)
{
  $scope.title = "MyTv Cast"
  $scope.play = function(){
    console.log($state)
    if ($rootScope.media && $rootScope.channels) {
      $state.go('home-play')
    }
  }
  
  $scope.logout = function(){
    $scope.safeApply(function () {
      $window.sessionStorage.clear()
      $rootScope.auth = {}
    })
    console.log('logout')
    console.log($window.sessionStorage)
    console.log($rootScope.auth)
    $location.path('/login')
  }
  
  $scope.edit = function(){
    console.log($state)
    if ($rootScope.media && $rootScope.channels) {
      $state.go('home-channel') 
    }
  }
  
  function init(){
    if(!('channels' in $rootScope)){
      $http({
        url: '/api/v1/cast/get/channel', 
        method: "GET",
        headers: {
          'Content-Type': 'json'
        }
      }).success(function(data) {
         console.log('Returned')
         console.log(data)
         $scope.safeApply(function () {
           $rootScope.channels = data
         })
      })
    }
    if(!('media' in $rootScope)){
      $http({
          url: '/api/v1/cast/get/media', 
          method: "GET",
          headers: {
            'Content-Type': 'json'
          }
       }).success(function(data) {
         $rootScope.media = data
      }).error(function(data) {
        console.log('Error1: ' + data)
      })
    }
  }
  init()
})