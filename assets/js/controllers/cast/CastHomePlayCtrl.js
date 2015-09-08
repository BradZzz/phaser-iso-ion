angular.module('blast').controller('CastHomePlayCtrl', function ($rootScope, $scope, $http, $window, $state, sender)
{
  sender.setup()
  $scope.channels = $rootScope.channels
  $scope.mediaMap = {}
  
  console.log($scope.channels)
  $scope.sParams = {
      prefix : "http://d1xdkehzbn1ea2.cloudfront.net/",
      suffix : "index.mp4"
  }
  $scope.params = {
      position : 0,
      cName : $scope.channels[0].name,
      media : {},
      ep : "",
      paused : true,
      casting : false,
      progress : 0,
      volume : 0.5,
      mediaView: true,
      epNumber : function () {
        var ep = this.ep.slice(0,-1)
        var rEp = ep.split('/')
        return rEp[rEp.length-1]
      }
  }
  $scope.controls = {
    init : function() {
      $scope.formatMedia()
      this.updateParams()
      this.loadMedia()
    },
    playMedia : function(){
      if ($scope.params.paused) {
        sender.playMedia()
      } else {
        sender.stopMedia()
      }
      $scope.params.paused = !$scope.params.paused
    },
    stopMedia : function(){sender.stopMedia()},
    seekMedia : function(){sender.seekMedia($scope.params.progress)},
    skipMedia : function()
    {
      console.log('forward')
      $scope.controls.loadMedia()
    },
    prevMedia : function()
    {
      console.log('backward')
      $scope.controls.loadMedia()
    },
    setVolume : function(){
      console.log('volume')
      console.log($scope.params.volume)
      sender.setReceiverVolume($scope.params.volume / 100, false)
    },
    chanUp : function(){
      $scope.params.position += 1
      if ($scope.params.position > $scope.channels.length - 1) {
        $scope.params.position = 0
      }
      $scope.controls.loadMedia()
      $scope.controls.updateParams()
      console.log($scope)
    },
    chanDown : function(){
      $scope.params.position -= 1
      if ($scope.params.position < 0) {
        $scope.params.position = $scope.channels.length - 1
      }
      $scope.controls.loadMedia()
      $scope.controls.updateParams()
      console.log($scope)
    },
    toggleCast : function(){
      $scope.params.casting = !$scope.params.casting
      if ($scope.params.casting) {
        sender.launchApp()
      } else {
        sender.stopApp()
      }
    },
    loadMedia : function(picked){
      sender.loadCustomMedia( $scope.sParams.prefix + $scope.controls.pickEp(picked) + $scope.sParams.suffix )
    },
    updateParams : function(){
      $scope.params.cName = $scope.channels[$scope.params.position].name
    },
    pickEp : function(picked){
      console.log(picked)
      /* pick media */
      var specific = $scope.channels[$scope.params.position].specific
      console.log('specific')
      console.log(specific)
      if (picked) {
        var media = $scope.mediaMap[specific[picked - 1].mId]
      } else {
        var media = $scope.mediaMap[specific[Math.floor((Math.random() * specific.length))].mId]
      }
      console.log('media')
      console.log(media)
      $scope.safeApply(function () {
        $scope.params.media = media
        $scope.params.ep = media.path
        /* pick episode if tv picked */
        console.log('Path: ' + $scope.params.ep)
        if (media.type === 'tv') {
          $scope.params.ep = media.episodes[Math.floor((Math.random() * media.episodes.length))]
        }
      })
      return $scope.params.ep
    },
    mediaMeta : function(){
      return _.map($scope.channels[$scope.params.position].specific, function(media){ return $scope.mediaMap[media.mId] });
    }
  }
  
  $scope.formatMedia = function(){
    console.log('rootscope')
    console.log($rootScope.media)
    for (var media in $rootScope.media) {
      var title = $rootScope.media[media]
      if ('imdbId' in title) {
        $scope.mediaMap[title.imdbId] = {
            id : title.imdbId,
            name : title.name,
            path : title.path,
            type : title.type,
            episodes : title.episodes,
            poster : title.poster,
            plot : title.plot,
            genre : title.genre,
            rated : title.rated,
            rating : title.imdbRating,
            year : title.year,
            runtime : title.runtime
        }
      }
    }
  }
  
  /*Listeners*/
  $scope.$on('update', function () {
    console.log('sender-update!')
  })
  $scope.$on('retry', function () {
    if ($scope.params.ep) {
      sender.loadCustomMedia( $scope.sParams.prefix + $scope.params.ep + $scope.sParams.suffix )
    }
  })
  $scope.$on('progress', function (scope, progress) {
    console.log('progress')
    console.log(scope)
    console.log(progress)
    document.getElementById('progress').value = progress
    //$scope.controls.loadMedia()
  })
  $scope.$on('finish', function () {
    $scope.controls.loadMedia()
  })
  
  /*toggle & select*/
  $scope.toggleItem = function (scopeVar) {
    $scope.safeApply(function () {
      $scope.params[scopeVar] = !$scope.params[scopeVar]
    })
    console.log(scopeVar)
    console.log($scope.params[scopeVar])
    console.log($scope.params.mediaView)
  }
  $scope.selectItem = function (item, scopeVar) {
    $scope.safeApply(function () {
      $scope.params[scopeVar] = item
    })
  }
  
  /*ng-class*/
  /*play button*/
  $scope.playClass = function(){
    return $scope.params.paused ? 'ion-arrow-right-b' : 'ion-pause'
  }
  /*cast button*/
  $scope.castClass = function(){
    return $scope.params.casting ? 'ion-android-hand' : 'ion-android-laptop'
  }
  
  /*nav*/
  $scope.close = function(){
    $state.go('home')
  }
  $scope.controls.init()
})