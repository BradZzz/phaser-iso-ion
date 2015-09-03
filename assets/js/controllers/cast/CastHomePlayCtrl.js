angular.module('blast').controller('CastHomePlayCtrl', function ($scope, $http, $window, $state)
{
  $scope.title = "Play"
  $scope.play = function(){
    console.log($state)
    $state.go('home.play')
  }
  $scope.edit = function(){
    console.log($state)
    $state.go('home.edit')
  }
  console.log('init')
})