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
      ep : "",
      paused : true,
      casting : false,
      progress : 0,
      volume : 0.5,
  }
  $scope.controls = {
    playMedia : function(){sender.playMedia()},
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
    setVolume : function(){sender.setReceiverVolume(1 - ($scope.params.volume / 100), false)},
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
    loadMedia : function(){
      sender.loadCustomMedia( $scope.sParams.prefix + $scope.controls.pickEp() + $scope.sParams.suffix )
    },
    updateParams : function(){
      $scope.params.cName = $scope.channels[$scope.params.position].name
    },
    pickEp : function(){
      /* pick media */
      var specific = $scope.channels[$scope.params.position].specific
      console.log('specific')
      console.log(specific)
      var media = $scope.mediaMap[specific[Math.floor((Math.random() * specific.length))].mId]
      console.log('media')
      console.log(media)
      $scope.params.ep = media.path
      /* pick episode if tv picked */
      console.log('Path: ' + $scope.params.ep)
      if (media.episodes.length > 0) {
        $scope.params.ep = media.episodes[Math.floor((Math.random() * media.episodes.length))]
      }
      return $scope.params.ep
    }
  }
  
  $scope.formatMedia = function(){
    for (var media in $rootScope.media) {
      var title = $rootScope.media[media]
      if ('imdbId' in title) {
        $scope.mediaMap[title.imdbId] = {
            path : title.path,
            episodes : title.episodes,
            poster : title.poster,
            plot : title.plot,
            genre : title.genre,
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
  $scope.$on('finish', function () {
    $scope.controls.loadMedia()
  })
  
  /*toggle & select*/
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
  
  $scope.formatMedia()
  $scope.controls.updateParams()
})