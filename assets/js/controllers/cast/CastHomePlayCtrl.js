angular.module('blast').controller('CastHomePlayCtrl', function ($rootScope, $scope, $http, $window, $state, sender, flash, mediaUtils)
{
  sender.setup()
  $scope.channels = $rootScope.channels
  $scope.media = $rootScope.media
  
  //console.log($scope.channels)
  /* The s is for static */
  $scope.sParams = {
      //switch this out for the s3 path if cloudfront becomes too expensive
      prefix : "http://d1xdkehzbn1ea2.cloudfront.net/",
      suffix : "index.mp4",
      dateFormat : "YYYY-MM-DD HH:mm:ss",
      tvOdds: .9, //The odds of picking a tv show as opposed to a movie
  }
  
  $scope.params = {
      position : 0,
      cName : $scope.channels[0].name,
      media : {},
      ep : "",
      paused : true,
      casting : false,
      prev : false,
      progress : 0,
      volume : 100,
      updateOffset : 0,
      mediaView: true,
      sticky : false,
      newest : false,
      ordered : false,
      interrupted: false,
      epNumber : function () {
        var ep = this.ep.slice(0,-1)
        var rEp = ep.split('/')
        return rEp[rEp.length-1]
      }
  }
  $scope.controls = {
    init : function() {
      this.calculateOffset()
      this.updateParams()
    },
    ordered: function(){
      //Models are set after clicks, so toggle here
      if (!$scope.params.ordered) {
        $scope.params.newest = false;
        $scope.params.sticky = true;
      }
    },
    refreshCast: function(){
      //Update media cache
      $http({
        url: '/api/v1/cast/update', 
        method: "GET",
        headers: {
          'Content-Type': 'json'
        }
      }).success(function(data) {
        //Update media scope
        $http({
          url: '/api/v1/cast/get/media', 
          method: "GET",
          headers: {
            'Content-Type': 'json'
          }
         }).success(function(data) {
           $scope.safeApply(function () {
             $rootScope.media = $scope.media = mediaUtils.formatMedia(data)
           })
           flash.success = "Media Updated!";
        }).error(function(data) {
          console.log('Error1: ' + data)
        })
      })
    },
    like : function() {
      var ep = $scope.params.media.type === 'movie' ? "" : $scope.params.ep.split("/")
      $http({
        url: '/api/v1/user/validate',
        method: "GET",
        params: $rootScope.auth,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(res) {
        $http({
          url: '/api/v1/cast/post/like',
          method: "POST",
          params: {
            'id'    : $scope.params.media.id,
            'like'  : sender.getCTime(),
            'ep'    : ep ? ep[ep.length-2] : "",
            'token' : $rootScope.auth.token,
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function(res) {
          flash.success = "Moment Liked!"
        }, function (err){
          console.log(err)
          flash.error = "Error Liking Moment!"
        })
      }, function(err){
        flash.error = "Error validating user"
      })
    },
    playMedia : function(){
      console.log('play toggle')
      if ($scope.params.paused) {
        sender.playMedia(false)
      } else {
        sender.playMedia(true)
      }
      $scope.params.paused = !$scope.params.paused
    },
    //stopMedia : function(){sender.stopMedia()},
    seekMedia : function(){
      sender.seekMedia($scope.params.progress)
      $('#progress').focusout()
    },
    skipMedia : function()
    {
      console.log('forward')
      $scope.params.prev = false
      this.loadMedia()
    },
    prevMedia : function()
    {
      console.log('backward')
      $scope.params.prev = true
      this.loadMedia()
    },
    setVolume : function(){
      sender.setReceiverVolume($scope.params.volume / 100, false)
      $('#volume').focusout()
    },
    chanUp : function(){
      this.saveChannelOffset()
      $scope.params.position += 1
      if ($scope.params.position > $scope.channels.length - 1) {
        $scope.params.position = 0
      }
      this.calculateOffset()
      this.updateParams()
    },
    chanDown : function(){
      this.saveChannelOffset()
      $scope.params.position -= 1
      if ($scope.params.position < 0) {
        $scope.params.position = $scope.channels.length - 1
      }
      this.calculateOffset()
      this.updateParams()
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
      /* pick media */
      var roll = chance.integer({min: 0, max: 100})
      var specific = $scope.channels[$scope.params.position].specific
      console.log('specific')
      console.log(specific)
      if (picked) {
        var media = $scope.media[picked]
      } else {
        var tSelected = []
        for (var file in specific) {
          if (specific[file].id in $scope.media && 'type' in $scope.media[specific[file].id]) {
            if (($scope.media[specific[file].id].type === 'tv' && roll <= $scope.sParams.tvOdds * 100)) {
              tSelected.push(specific[file])
            } else if ($scope.media[specific[file].id].type === 'movie' && roll > $scope.sParams.tvOdds * 100) {
              tSelected.push(specific[file])
            }
          }
        }
        if (tSelected.length === 0) {
          tSelected = specific
        } 
        console.log('picked',tSelected)
        //If the media is not picked, make sure that the media playing before isnt the media playing now
        console.log($scope.params.media)
        var mId = $scope.params.sticky ? $scope.params.media.id : tSelected[chance.integer({min: 0, max: tSelected.length})].id
        while (!$scope.params.sticky && mId === $scope.params.media.id && tSelected.length > 1) {
          mId = tSelected[chance.integer({min: 0, max: tSelected.length})].id
        }
        var media = $scope.media[mId]
        console.log('media!')
        console.log(media)
      }
      $scope.safeApply(function () {
        $scope.params.media = media
        var lPath = $scope.params.ep
        $scope.params.ep = media.path
        /* pick episode if tv picked */
        if (media.type === 'tv') {
          if ($scope.params.ordered) {
            var index = media.episodes.indexOf(lPath);
            if ($scope.params.prev) {
              index -= 1
              if (index < 0) {index = media.episodes.length-1}
            } else {
              index += 1
              if (index > media.episodes.length-1) {index = 0}
            }
            $scope.params.ep = media.episodes[index]
          }else if ($scope.params.newest) {
            $scope.params.ep = media.episodes[media.episodes.length-1]
          } else {
            $scope.params.ep = media.episodes[chance.integer({min: 0, max: media.episodes.length})]
          }
        }
      })
      console.log('media', media)
      console.log('path', $scope.params.ep)
      return $scope.params.ep
    },
    mediaMeta : function(){
      return _.sortBy(_.map($scope.channels[$scope.params.position].specific, function(media){ return $scope.media[media.id] }),'name')
    },
    calculateOffset: function(){
      var channelTmp = $scope.channels[$scope.params.position]
      var ms = moment(channelTmp.lastOffset,$scope.sParams.dateFormat).diff(moment(moment().format($scope.sParams.dateFormat),$scope.sParams.dateFormat))
      var dWait = moment.duration(Math.abs(ms)).seconds()
     
      console.log(channelTmp.lastMediaCurrent)
      console.log(channelTmp.lastMediaDuration)
      console.log(dWait)
      //sender.seekMedia($scope.params.progress)
      
      if (channelTmp.lastMediaCurrent + dWait > channelTmp.lastMediaDuration) {
        $scope.params.updateOffset = (channelTmp.lastMediaCurrent + dWait) - channelTmp.lastMediaDuration
        //Here we want to pick something new
        this.loadMedia()
      } else {
        $scope.params.updateOffset = channelTmp.lastMediaCurrent + dWait
        //Here we want to use the same episodes and media as before
        $scope.safeApply(function () {
          $scope.params.media = media = $scope.media[$scope.channels[$scope.params.position].lastId]
          if ($scope.params.media.type === 'tv') {
            $scope.params.ep = $scope.channels[$scope.params.position].lastEp
          } else {
            $scope.params.ep = $scope.params.media.path
          }
          console.log($scope.params)
        })
        sender.loadCustomMedia( $scope.sParams.prefix + $scope.params.ep + $scope.sParams.suffix )
      }
      console.log('offset params')
      console.log($scope.params)
    },
    saveChannelOffset: function(){
      
      var channel = angular.copy($scope.channels[$scope.params.position])
      
      channel.lastId = $scope.params.media.id
      channel.lastEp = $scope.params.media.type === 'tv' ?  $scope.params.ep : ""
      channel.lastMediaCurrent = sender.mediaPosition().current ? sender.mediaPosition().current : 0
      channel.lastMediaDuration = sender.mediaPosition().duration ? sender.mediaPosition().duration : 0
      channel.lastOffset = moment().format($scope.sParams.dateFormat)
      
      console.log(sender.mediaPosition())
      
      $http({
        url: '/api/v1/cast/post/channel',
        method: "POST",
        params: channel,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(res) {
        console.log('Channel Offset Saved!')
        console.log(res)
      }, function(err){
        console.log('Error Saving Channel Offset')
        console.log(err)
      })
    }
  }
  
  /*Listeners*/
  //Check to see if you can queue media in a videoview
  $scope.$on('update', function (scope, media) {
    if (media.playerState === "PLAYING" && $scope.params.updateOffset && $scope.params.updateOffset > 0 && $scope.params.progress < 2 && !$scope.params.interrupted) {
      var mLength = sender.mediaPosition().duration
      sender.seekMedia( 100 * (($scope.params.updateOffset % mLength) / mLength))
      $scope.params.updateOffset = 0
      $scope.controls.saveChannelOffset()
    } /*else if (media.playerState === "PLAYING") {
      //Clear the UI objects if we aren't trying to update
      sender.clearTimerInterval();
    }*/ else if (media.playerState === "PLAYING" && $scope.params.interrupted) {
      //Somewhere between 20% and 80% skip
      console.log('skip!!!')
      $scope.params.interrupted = false
      sender.seekMedia( 20 + chance.integer({min: 0, max: 60}))
    }
  })
  $scope.$on('retry', function () {
    if ($scope.params.ep) {
      sender.loadCustomMedia( $scope.sParams.prefix + $scope.params.ep + $scope.sParams.suffix )
    }
  })
  $scope.$on('progress', function (scope, progress) {
    console.log('progress: ',progress)
    $scope.safeApply(function () {
      $scope.params.progress = progress
    })
  })
  $scope.$on('finish', function () {
    $scope.controls.loadMedia()
  })
  $scope.$on('init', function () {
    $scope.controls.init()
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
    return $scope.params.paused ? 'ion-pause' : 'ion-arrow-right-b'
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