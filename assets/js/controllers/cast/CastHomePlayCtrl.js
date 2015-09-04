angular.module('blast').controller('CastHomePlayCtrl', function ($scope, $http, $window, $state)
{
  $scope.title = "Play"
  $scope.params = {
      paused : true
  }
  $scope.playClass = function(){
    return $scope.params.paused ? 'ion-arrow-right-b' : 'ion-pause'
  }
  $scope.toggleItem = function (item, scopeVar) {
    $scope.safeApply(function () {
      $scope.params[scopeVar] = !$scope.params[scopeVar]
    })
  }
  $scope.selectItem = function (item, scopeVar) {
    $scope.safeApply(function () {
      $scope.params[scopeVar] = item
    })
  }
  $scope.skipBackward = function(){
    console.log('backward')
  }
  $scope.skipForward = function(){
    console.log('forward')
  }
  $scope.close = function(){
    $state.go('home')
  }
  console.log('init')
})