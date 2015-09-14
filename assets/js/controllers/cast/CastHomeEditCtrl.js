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
      genreList : []
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
      if ($scope.config.genreList.indexOf($scope.media[index].genre[gIndex]) == -1){
        var genre = $scope.media[index].genre[gIndex]
        $scope.config.genreList.push(genre)
      }
    }
  }
  $scope.config.genreList.sort()
  $scope.config.genreList.splice(0, 0, 'All')
  _.sortBy($scope.selectedChannel.specific, 'name')
  
  $scope.filterMedia = function(){
    return function( item ) {
      console.log(item)
      return item.type === $scope.params.sType && !_.findWhere($scope.selectedChannel.specific, {'mId': item.imdbId})
    };
  }
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
  
  $scope.createSpecific = function (media){
    console.log(media)
    console.log($scope.selectedChannel)
    $scope.selectedChannel.specific.push({
      name : JSON.parse(JSON.stringify(media.name)),
      poster : JSON.parse(JSON.stringify(media.poster)),
      rated : JSON.parse(JSON.stringify(media.rated)),
      rating : JSON.parse(JSON.stringify(media.imdbRating)),
      genre : JSON.parse(JSON.stringify(media.genre)),
      mId : JSON.parse(JSON.stringify(media.imdbId)),
      type : JSON.parse(JSON.stringify($scope.params.mType))
    })
    console.log($scope.selectedChannel)
    _.sortBy($scope.selectedChannel.specific, 'name')
  }
  
  $scope.chanName = function() {
    for (var chan in $rootScope.channels){
      if ($rootScope.selectedChannel._id !== $rootScope.channels[chan]._id 
          && $rootScope.selectedChannel.name === $rootScope.channels[chan].name) {
        return true
      }
    }
    return false
  }
  
  $scope.createTag = function () {
    $scope.selectedChannel.general.push({
      name : "",
      poster : "",
      rated : JSON.parse(JSON.stringify($scope.params.mRated)),
      rating : JSON.parse(JSON.stringify($scope.params.mRating)),
      genre : $scope.params.genre.slice(),
      mId : "",
      type : JSON.parse(JSON.stringify($scope.params.mType)),
    })
  }
  $scope.save = function(){
    if ('$$hashKey' in $scope.selectedChannel) {
      delete $scope.selectedChannel['$$hashKey']
      //Everything besides the imdbid key needs to be deleted here
    }
    $http({
      url: '/api/v1/cast/post/channel',
      method: "POST",
      params: $scope.selectedChannel,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(res) {
      if (res.status === 200) {
        if (!_.findWhere($rootScope.channels, {name: $scope.selectedChannel.name})){
          $rootScope.channels.push($scope.selectedChannel)
        }
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