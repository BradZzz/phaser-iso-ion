angular.module('blast').controller('CastHomeEditCtrl', function ($stateParams,$scope, $rootScope, $http, $window, $state, flash)
{
  $scope.title = "Edit"
  
  //Available options
  $scope.config = {
      filterList : [
        {type: 'general',
         name: 'General',
         desc: 'By Genre/Rating/Rated'},
        {type: 'specific',
         name: 'Specific',
         desc: 'By Specific Tv/Movie'}
      ],
      ratingsList : ['G','PG','PG-13','R','All'],
      specificList : [
        {type: 'movie',
         name: 'Movie',
         desc: 'Pick Specific Movie'},
        {type: 'tv',
         name: 'Tv',
         desc: 'Pick Specific Tv Show'}
      ],
      genreList : {}
  }
  
  //Presets and save vars
  $scope.params = {
      mType : 'general',
      sType : 'tv',
      mRated : 'All',
      mRating : 9,
      genre : [],
  }

  //This is a copy of all the available media meta
  $scope.media = $rootScope.media
  console.log($scope.media)
  for (var index in $scope.media) {
    for (var gIndex in $scope.media[index].genre) {
      if (!($scope.media[index].genre[gIndex] in $scope.config.genreList)) {
        var genre = $scope.media[index].genre[gIndex]
        $scope.config.genreList[genre] = genre
      }
    }
  }
  $scope.config.genreList['All'] = 'All'
  $scope.play = function(){
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
      $scope.params.mRating = rating
    })
  }
  $scope.selectRated = function(rated){
    $scope.safeApply(function () {
      $scope.params.mRated = rated
    })
  }
  
  $scope.toggleGenre = function (item, list) {
    var idx = list.indexOf(item)
    if (idx > -1) list.splice(idx, 1)
    else list.push(item)
    console.log(list)
  }
  $scope.createTag = function () {
    $scope.selectedChannel.media.push({
      rated : JSON.parse(JSON.stringify($scope.params.mRated)),
      rating : JSON.parse(JSON.stringify($scope.params.mRating)),
      genre : $scope.params.genre.slice(),
      type : JSON.parse(JSON.stringify($scope.params.mType)),
    })
  }
  $scope.save = function(){
    if ('$$hashKey' in $scope.selectedChannel) {
      delete $scope.selectedChannel['$$hashKey']
    }
    $http({
          url: '/api/v1/cast/post/channel',
          method: "POST",
          params: $scope.selectedChannel,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        }).then(function(res) {
      if (res.status === 200) {
        $state.go('home-channel')
      } else {
        flash.error = "Error saving channel"
        console.log(res)
      }
    })
  }
  
  //ng-click helper
  $scope.selectItem = function (item, scopeVar) {
    $scope.safeApply(function () {
      $scope.params[scopeVar] = item
    })
  }
  
  //ng-class helper
  $scope.isSelectedClass = function(option, active){
    return option === active ? 'md-primary' : ''
  }
})