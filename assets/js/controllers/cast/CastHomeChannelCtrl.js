angular.module('blast').controller('CastHomeChannelCtrl', function ($scope, $rootScope, $http, $state, flash)
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
  $scope.deleteChannel = function(channel){
    console.log('deleting...', channel)
    $http({
      url: '/api/v1/cast/delete/channel',
      method: "POST",
      params: channel,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(res) {
      if (res.status === 200) {
        flash.success = "Channel deleted successfully!"
        $scope.channels = $rootScope.channels = _.filter($rootScope.channels, function(chan){ return chan._id !== channel._id });
      } else {
        flash.error = "Error deleting channel"
        console.log(res)
      }
    })
  }
  $scope.editChannel = function(channel){
    $rootScope.selectedChannel = channel
    $state.go('home-edit')
  }
})