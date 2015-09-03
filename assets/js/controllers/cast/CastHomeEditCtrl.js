angular.module('blast').controller('CastHomeEditCtrl', function ($stateParams,$scope, $rootScope, $http, $window, $state)
{
  $scope.title = "Edit"
  $scope.mRated = 'All'
  $scope.ratingsList = ['G','PG','PG-13','R','All']
  $scope.mRating = 9
  $scope.media = $rootScope.media
  $scope.genres = {}
  for (var index in $scope.media) {
    console.log($scope.media[index].genre)
    for (var gIndex in $scope.media[index].genre) {
      console.log($scope.media[index].genre[gIndex])
      if (!($scope.media[index].genre[gIndex] in $scope.genres)) {
        var genre = $scope.media[index].genre[gIndex]
        console.log(genre)
        $scope.genres[genre] = genre
      }
    }
  }
  $scope.play = function(){
    console.log($state)
    $state.go('home-play')
  }
  $scope.close = function(){
    $state.go('home-channel')
  }
  $scope.editChannel = function(channel){
    console.log('edit!')
    console.log(channel)
  }
  $scope.selectRating = function(rating){
    $scope.safeApply(function () {
      $scope.mRating = rating
    })
    console.log($scope)
  }
  $scope.selectRated = function(rated){
    $scope.safeApply(function () {
      $scope.mRated = rated
    })
    console.log($scope)
  }
  $scope.selectRatedClass = function(rated){
    return $scope.mRated === rated ? 'md-primary' : ''
  }
  console.log('init')
  console.log($scope)
  //init()
})