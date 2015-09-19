angular.module('blast').service('mediaUtils', function () {
  
  //These are all the keys a media object needs to have
  var mediaKeys = {
    'imdbId' : 'id',
    'name' : 'name',
    'path' : 'path',
    'type' : 'type',
    'episodes' : 'episodes',
    'poster' : 'poster',
    'plot' : 'plot',
    'genre' : 'genre',
    'rated' : 'rated',
    'imdbRating' : 'rating',
    'year' : 'year',
    'runtime' : 'runtime'
  }
  
  function hasAllKeys(mediaObject){
    for (var key in mediaKeys){
      if (!(key in mediaObject)) {
        return false
      }
    }
    return true
  }
  
  this.formatMedia = function(rootMap){
    var mediaMap = {}
    for (var media in rootMap) {
      var title = rootMap[media]
      if (hasAllKeys(title)) {
        mediaMap[title.imdbId] = {}
        for (var key in mediaKeys){
          mediaMap[title.imdbId][mediaKeys[key]] = title[key]
        }
      }
    }
    return mediaMap
  }
  
});
