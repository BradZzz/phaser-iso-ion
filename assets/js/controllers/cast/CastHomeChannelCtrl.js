angular.module('blast').controller('CastHomeChannelCtrl', function ($scope, $rootScope, $http, $window, $state, $rootScope)
{
  $scope.title = "Channels"
  $scope.channels = $rootScope.channels
  $scope.play = function(){
    console.log($state)
    $state.go('home-play')
  }
  $scope.close = function(){
    $state.go('home')
  }
  $scope.editChannel = function(channel){
    console.log('edit!')
    console.log(channel)
    $scope.safeApply(function () {
      $rootScope.selectedChannel = channel
    })
    $state.go('home-edit')
  }
})