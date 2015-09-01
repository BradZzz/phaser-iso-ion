var Media    = require('../models/media')
//var Channel  = require('../models/channel')
var Q = require('q')
var _ = require('underscore')
var omdbApi = require('omdb-client')
var return_count = 0

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
			  console.log('finished update!')
			  _.each(results.splice(results.length-1, 1)[0], function(result){
			    results.push(result)
        })
			  console.log(results)
			  console.log('before save')
			  var promises = []
			  _.each(results, function(result){
			    result.name = result.name.replace(/_/g,' ').capitalize()
			    promises.push(save(result))
			  })
			  console.log('before save all')
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
    console.log('saving...')
    if (result.poster === "") {
      console.log('bad value')
      console.log(result)
    }
    return Media.findOneAndUpdate({'name':result.name}, result, {upsert:true}).exec()
  }
  
  function checkMedia(mediaObject, episodes){
    var media = {}
    media.path = mediaObject.Prefix
    media.type = mediaObject.Prefix.indexOf('movie') > -1 ? 'movie' : 'tv'
    media.name = mediaObject.Prefix.replace("tv2/","").replace("movies2/","").replace("/","")
    media.episodes = _.map(episodes, function(episode){
      return episode.Prefix
    })
    return requestMeta(media)
  }
  
  function requestMeta(media) {
    var deferred = Q.defer()
    var params = {
        title: media.name.replace(/_/g, '+').capitalize(),
        plot: 'short',
        r: 'json',
    }
    omdbApi.get(params, function(err, data) {
        if (err) {
          console.log('returned meta error')
          console.log(media.name)
          console.log(data)
          console.log(err)
          console.log('ended meta error')
          return_count -= 1
          console.log('Count: ' + return_count)
          /*media.poster = ""
          media.plot = ""
          media.genre = []
          media.imdbRating = 0
          media.imdbId = ""
          media.year = "1900"*/
          deferred.resolve(media)
        } else {
          console.log('returned meta')
          console.log(media.name)
          console.log(data)
          console.log('ended meta')
          return_count -= 1
          console.log('Count: ' + return_count)
          media.poster = data.Poster
          media.plot = data.Plot
          media.genre = data.Genre
          media.imdbRating = data.imdbRating
          media.imdbId = data.imdbID
          media.year = data.Year
          media.runtime = data.Runtime
          deferred.resolve(media)
        }
    })
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
			  return_count += data.CommonPrefixes.length
			  _.each(data.CommonPrefixes, function(path){
				  promises.push(checkMedia(path))
			  })
			  Q.all(promises).then(function(results) {
  				console.log('returned!')
  				console.log(results)
  				console.log('finished return')
  				deferred.resolve(results)
			  }, function (err){
			    console.log('err!')
			    console.log(err)
			  })
		  } else {
		    return_count += 1
			  var returned = checkMedia(data, data.CommonPrefixes)
			  //console.log(returned)
			  deferred.resolve(returned)
		  }
		})
		return deferred.promise
	}
}
