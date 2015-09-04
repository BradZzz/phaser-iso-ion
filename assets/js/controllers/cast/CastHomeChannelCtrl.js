angular.module('blast').controller('CastHomeChannelCtrl', function ($scope, $rootScope, $http, $window, $state, $rootScope)
{
  $scope.title = "Channels"
  $scope.channels = $rootScope.channels
  $scope.add = function(){
    $rootScope.selectedChannel = {
      name: "",
      position: 1,
      specific: [],
      general: [] 
    }
    $state.go('home-edit')
  }
  $scope.close = function(){
    $state.go('home')
  }
  $scope.editChannel = function(channel){
    $rootScope.selectedChannel = channel
    $state.go('home-edit')
  }
})