angular.module('blast').controller('MediaCtrl', function ($scope, $http, $window, sender)
{
  /*Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == deleteValue) {         
        this.splice(i, 1)
        i--
      }
    }
    return this
  }

  String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); })
  }*/
  
  
  $scope.media = {}
  $scope.features = {}
  $scope.curMedia = {}
  $scope.television = true
  $scope.scopeMediaSelected = ""
  $scope.pathReplace = {
      'tv' : 'tv2/',
      'movies' : 'movies2/',
  }
    
  $window.$scope = $scope
  var popup = 'popup'
  
  $scope.$on('update', function () {
    console.log('sender-update!')
  })
  
  $scope.$on('retry', function () {
    console.log('retrying: ' + $scope.curMedia['full_path'])
    if ($scope.curMedia['full_path']) {
      sender.loadCustomMedia($scope.curMedia['full_path'])
    }
  })
  
  $scope.$on('finish', function () {
    console.log('finished!')
    $scope.scopeMediaSelected = $scope.curMedia.Eps[Math.floor((Math.random() * $scope.curMedia.Eps.length))]
    $scope.play($scope.scopeMediaSelected)
  })
    
  $scope.playMedia = function(){
    sender.playMedia()
  }
    
  $scope.stopMedia = function(){
    sender.stopMedia()
  }
    
  $scope.loadMedia = function(){
    sender.loadMedia()
  }
    
  $scope.launchApp = function(){
    sender.launchApp()
  }
  
  $scope.stopApp = function(){
    sender.stopApp()
  }
    
  $scope.seekMedia = function(){
    sender.seekMedia($scope.seek)
  }

  $scope.setReceiverVolume = function(){
    console.log($scope)
    sender.setReceiverVolume(1 - ($scope.volume / 100), false)
  }
    
  $scope.load = function(){
    $http({
        url: '/api/v1/cast/get/media', 
        method: "GET",
        headers: {
          'Content-Type': 'json'
        }
     }).success(function(data) {
       console.log(data)
      $scope.folders = data
      console.log($scope.folders)
      
      _.each($scope.folders, function(value, key, obj) {
         $scope.media[value.name] = {
           Runtime : value.runtime ? value.runtime : "" ,
           Rating : value.imdbRating ? value.imdbRating : "" ,
           Genre : value.genre ? value.genre : "" ,
           Summary : value.plot ? value.plot : "" ,
           Poster : value.poster ? value.poster : "" ,
           s3_mid : value.path,
           Eps : value.episodes ? value.episodes : [],
           isTelevision : value.type === 'tv',
         }
      })
      
    }).error(function(data) {
      console.log('Error1: ' + data)
    })
  }
  
  $scope.setShow = function(show) {
    console.log("Setting Show")
    console.log(show)
    console.log($scope.media[show])
    $scope.safeApply(function(){
      $scope.curMedia = $scope.media[show]
    })
  }
  
  $scope.castEpisode = function(episode) {
    console.log(episode)
  }
  
  $scope.formatEpisode = function(episode) {
    var parts = episode.split('/').clean("")
    return parts[parts.length-1]
  }
  
  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };
  
  $scope.showSelection = function(is_television){
    return $scope.television === is_television
  }
  
  $scope.launchViewer = function() {
    if ($scope.curMedia['full_path'] !== "") {
      //console.log(popup)
      //console.log($scope.curMedia['full_path'])
      var popupWindow = window.open(popup)
      popupWindow.mothership_data = $scope.curMedia['full_path']
    }
  }
  
  $scope.selectMedia = function(ep) {
    //console.log(ep)
    //console.log($scope.scopeMediaSelected)
    return ep === $scope.scopeMediaSelected
  }
  
  $scope.play = function(ep) {
    console.log('play')
    console.log(ep)
    console.log($scope.scopeMediaSelected)
    if ($scope.scopeMediaSelected === ep || !(ep.indexOf($scope.pathReplace['tv']) > -1)) {
      $scope.scopeMediaSelected = ""
      var prefix = "http://d1xdkehzbn1ea2.cloudfront.net/"
      var suffix = "index.mp4"
      console.log(prefix + ep + suffix)
      $scope.curMedia['full_path'] = prefix + ep + suffix
      sender.loadCustomMedia( prefix + ep + suffix )
      var epLabel = ep.replace($scope.pathReplace['tv'],"").replace($scope.pathReplace['movies'],"").slice(0, - 1).replace("/"," (").replace(/_/g, ' ')
      if(ep.indexOf($scope.pathReplace['tv']) > -1){
        epLabel += ')'
      }
      $('.current-media').text(epLabel)
    } else {
      $scope.scopeMediaSelected = ep
    }
  }
  
  var down=false;
  var scrollTop=0;
  var y = 0;
  
  $('.hold_scrollable').mousedown(function(e) {
      down = true;
      scrollTop = this.scrollTop;
      y = e.clientY;
  }).mouseup(function() {
      down = false;
  }).mousemove(function(e) {
      if (down) {
         this.scrollTop = scrollTop + y - e.clientY;
      }
  }).mouseleave(function() {
      down = false;
  });

  $scope.changeTelevision = function(change_to_television){
    if (change_to_television) {
      $scope.safeApply(function(){
        $scope.television = true
      })
      $('.movies_placeholder').removeClass( "active" )
      $('.television_placeholder').addClass( "active" )
      for (var key in $scope.media) {
        console.log(key)
        console.log($scope.media[key])
        if ($scope.media[key].isTelevision) {
          $scope.curMedia = $scope.media[key]
          break;
        }
      }
    } else {
      $scope.safeApply(function(){
        $scope.television = false
      })
      $('.movies_placeholder').addClass( "active" )
      $('.television_placeholder').removeClass( "active" )
      for (var key in $scope.media) {
        console.log(key)
        console.log($scope.media[key])
        if (!$scope.media[key].isTelevision) {
          $scope.curMedia = $scope.media[key]
          console.log("Switched!")
          console.log($scope.curMedia)
          break;
        }
      }
    }
  }
  
  $scope.showOverlay = function(){
    $(".overlay").css('background-color', 'rgba(0, 0, 0, 0.5)')
    $(".overlay").css('opacity', '1')
  }
  
  $scope.hideOverlay = function(){
    $(".overlay").css('background-color', 'rgba(0, 0, 0, 0)')
    $(".overlay").css('opacity', '0')
  }
  
  $scope.load()
})