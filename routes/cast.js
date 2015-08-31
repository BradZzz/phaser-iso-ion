var Media    = require('../models/media')
//var Channel  = require('../models/channel')
var Q = require('q')
var _ = require('underscore')
var APIClient = require('omdb-api-client')
var omdb = new APIClient()

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

module.exports = function (app) {
  app.get('/api/v1/cast/get', function (req, res) {
    Media.find({}).exec(function (err, messages) {
      return res.status(200).json(messages)
    })
  })
  
  app.get('/api/v1/cast/update', function (req, res) {
	  loop_folder('tv2/').then(function(results){
			console.log(results)
			var promises = []
			for (var result in results ) {
				promises.push(update(results[result]))
			}
			promises.push(update('movies2/'))
			Q.all(promises).then(function(results) {
			  _.each(results.splice(results.length-1, 1)[0], function(result){
			    results.push(result)
        })
			  console.log(results)
			  var promises = []
			  _.each(results, function(result){
			    result.name = result.name.replace("_"," ").capitalize()
			    promises.push(save(result))
			  })
				Q.all(promises).then(function(result) {
				  return res.status(200).json(results)
				}, function(err) {
				  return res.status(500).json({ debug: err })
				})
			}, function(err) {
        return res.status(500).json({ debug: err })
      })
		})
  })
  
  function save(result){
    return Media.update(
        {name: result.name.replace("_"," ").capitalize()}, 
        {$setOnInsert: result}, 
        {upsert: true}).exec()
  }
  
  function requestMeta(name) {
    omdb({t:name, y : '', plot : 'short', r : 'json'}).list().then(function(movie) {
      console.log(movie);
    }).catch(function(err) {
      console.log(err);
    });
  }
  
  function checkMedia(mediaObject, episodes){
    var deferred = Q.defer()
    
    var media = {}
    media.path = mediaObject.Prefix
    media.type = mediaObject.Prefix.indexOf('movie') > -1 ? 'movie' : 'tv'
    media.name = mediaObject.Prefix.replace("tv2/","").replace("movies2/","").replace("/","")
    requestMeta(media.name)
    media.genre = []
    media.poster = 'none'
    media.episodes = _.map(episodes, function(episode){
      return episode.Prefix
    })
    media.rating = 0
    deferred.resolve(media)
    
    return deferred.promise
  }
  
  function loop_folder(prefix) {
    var AWS = require('aws-sdk')
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    var s3 = new AWS.S3()
    var delimiter = '/'
    var deferred = Q.defer();
      
    s3.listObjects({ Bucket: 'mytv.media.out.video', MaxKeys: 100000, Prefix: prefix, Delimiter: delimiter }, function(err, data) {
      var folders = []
      if (err) {
        console.log(err, err.stack)
        deferred.reject(err)
      }
      for (var prefix in data.CommonPrefixes ) {
        folders.push(data.CommonPrefixes[prefix].Prefix)
      }
      deferred.resolve(folders)
    });
    return deferred.promise
  }
  
  function update(prefix){
		var AWS = require('aws-sdk')
		AWS.config.update({
		    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		});
		var s3 = new AWS.S3()
		var Q = require('q')
		var deferred = Q.defer()
		var media = {}
		
		s3.listObjects({ Bucket: 'mytv.media.out.video', MaxKeys: 100000, Prefix: prefix, Delimiter: '/' }, function(err, data) {
			var folders = []
			if (err) {
				console.log(err, err.stack)
				deferred.reject(err)
			}
		  if (data.Prefix.indexOf("movie") > -1) {
			  console.log('movie!')
			  console.log(data.CommonPrefixes)
			  var promises = []
			  _.each(data.CommonPrefixes, function(path){
				  promises.push(checkMedia(path))
			  })
			  Q.all(promises).then(function(results) {
  				//console.log('returned!')
  				//console.log(results)
  				deferred.resolve(results)
			  })
		  } else {
			  var returned = checkMedia(data, data.CommonPrefixes)
			  //console.log(returned)
			  deferred.resolve(returned)
		  }
		})
		return deferred.promise
	}
}
