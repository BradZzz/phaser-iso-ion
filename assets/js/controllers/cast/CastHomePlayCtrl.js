angular.module('blast').controller('CastHomePlayCtrl', function ($rootScope, $scope, $http, $window, $state, sender)
{
  sender.setup()
  $scope.channels = $rootScope.channels
  $scope.mediaMap = {}
  
  console.log($scope.channels)
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
      progress : 0,
      volume : 100,
      updateOffset : 0,
      mediaView: true,
      sticky : false,
      epNumber : function () {
        var ep = this.ep.slice(0,-1)
        var rEp = ep.split('/')
        return rEp[rEp.length-1]
      }
  }
  $scope.controls = {
    init : function() {
      $scope.formatMedia()
      this.calculateOffset()
      this.updateParams()
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
    seekMedia : function(){sender.seekMedia($scope.params.progress)},
    skipMedia : function()
    {
      console.log('forward')
      this.loadMedia()
    },
    prevMedia : function()
    {
      console.log('backward')
      this.loadMedia()
    },
    setVolume : function(){
      sender.setReceiverVolume($scope.params.volume / 100, false)
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
      console.log(picked)
      /* pick media */
      var specific = $scope.channels[$scope.params.position].specific
      console.log('specific')
      console.log(specific)
      if (picked) {
        var media = $scope.mediaMap[picked]
      } else {
        var tSelected = []
        var roll = Math.random()
        for (var file in specific) {
          if (($scope.mediaMap[specific[file].mId].type === 'tv' && roll <= $scope.sParams.tvOdds)) {
            tSelected.push(specific[file])
          } else if ($scope.mediaMap[specific[file].mId].type === 'movie' && roll > $scope.sParams.tvOdds) {
            tSelected.push(specific[file])
          }
        }
        if (tSelected.length === 0) {
          tSelected = specific
        } 
        console.log('picked',tSelected)
        //If the media is not picked, make sure that the media playing before isnt the media playing now
        console.log($scope.params.media)
        var mId = $scope.params.sticky ? $scope.params.media.id : tSelected[Math.floor((Math.random() * tSelected.length))].mId
        while (!$scope.params.sticky && mId === $scope.params.media.id && tSelected.length > 1) {
          mId = tSelected[Math.floor((Math.random() * tSelected.length))].mId
        }
        var media = $scope.mediaMap[mId]
      }
      $scope.safeApply(function () {
        $scope.params.media = media
        $scope.params.ep = media.path
        /* pick episode if tv picked */
        if (media.type === 'tv') {
          $scope.params.ep = media.episodes[Math.floor((Math.random() * media.episodes.length))]
        }
      })
      console.log('media', media)
      console.log('path', $scope.params.ep)
      return $scope.params.ep
    },
    mediaMeta : function(){
      return _.sortBy(_.map($scope.channels[$scope.params.position].specific, function(media){ return $scope.mediaMap[media.mId] }),'name')
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
          $scope.params.media = media = $scope.mediaMap[$scope.channels[$scope.params.position].lastId]
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
      $scope.channels[$scope.params.position].lastId = $scope.params.media.id
      $scope.channels[$scope.params.position].lastEp = $scope.params.media.type === 'tv' ?  $scope.params.ep : ""
      $scope.channels[$scope.params.position].lastMediaCurrent = sender.mediaPosition().current ? sender.mediaPosition().current : 0
      $scope.channels[$scope.params.position].lastMediaDuration = sender.mediaPosition().duration ? sender.mediaPosition().duration : 0
      $scope.channels[$scope.params.position].lastOffset = moment().format($scope.sParams.dateFormat)
      
      console.log(sender.mediaPosition())
      
      $http({
        url: '/api/v1/cast/post/channel',
        method: "POST",
        params: $scope.channels[$scope.params.position],
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(res) {
        if (res.status === 200) {
          console.log('Channel Offset Saved!')
        } else {
          console.log('Error Saving Channel Offset')
        }
      })
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
  $scope.$on('update', function (scope, media) {
    console.log('update')
    if (media.playerState === "PLAYING" && $scope.params.updateOffset && $scope.params.updateOffset > 0) {
      var mLength = sender.mediaPosition().duration
      sender.seekMedia( 100 * (($scope.params.updateOffset % mLength) / mLength))
      $scope.params.updateOffset = 0
      $scope.controls.saveChannelOffset()
    }
  })
  $scope.$on('retry', function () {
    console.log('retry')
    if ($scope.params.ep) {
      sender.loadCustomMedia( $scope.sParams.prefix + $scope.params.ep + $scope.sParams.suffix )
    }
  })
  $scope.$on('progress', function (scope, progress) {
    //console.log('progress: ',progress)
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
})