'use strict';

var fs = require('fs');
var ffmpeg = require('ffmpeg');
var Q = require('q');
var _ = require('underscore')
var mv = require('mv')

var parentPath = require('path').dirname(require.main.filename);

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/directory");
    process.exit(-1);
}

if (process.argv.length <= 3) {
  console.log("Usage: specify number of concurrent threads");
  process.exit(-1);
}

var vidPRomise = function(path, dest){
  var deferred = Q.defer();
  
  try {
    var process = new ffmpeg(path);
    process.then(function (video) {
      
      // Video metadata
      console.log(video.metadata)
      console.log('Path: ' + path)
      console.log('Dest: ' + dest)
      // FFmpeg configuration
      //console.log(video.info_configuration);
      //ffmpeg -i 413.mp4 -acodec libfaac -vcodec libx264 -profile:v baseline -level 3.0 converted/413.mp4
      video.addCommand('-acodec', 'libfaac');
      video.addCommand('-vcodec', 'libx264')
      video.addCommand('-profile:v', 'baseline')
      video.addCommand('-level', '3.0');
      video.save(dest, function (err, file) {
        
        console.log(file)
        
        if (!err) {
          console.log('finished: ' + file)
          deferred.resolve(file);
        } else {
          console.log('error')
          console.log(err)
          deferred.reject('Error: ' + err);
        }
      });
    }, function (err) {
      console.log('error')
      console.log(err)
      deferred.reject('Error: ' + err);
    });
  } catch (err) {
    console.log('error')
    console.log(err)
  }
  
  return deferred.promise
}

var loop = function (movPromises) {
  
  var raw = movPromises[0]
  
  //console.log('Converting batch: ' + raw)

  var promise = compile(raw)
  
  //console.log(promise)
  
  promise.then(function (result) {
    console.log('conversion finished')
    console.log(result)
    console.log('before')
    console.log(movPromises)
    movPromises.splice(0,1)
    console.log('next')
    console.log(movPromises)
    if (movPromises.length > 0) {
      loop(movPromises)
    } else {
      console.log('done')
      process.exit()
    }
  });
  
  /*Q.all(promises).then(function (results) {
    console.log('conversion finished')
    console.log(results)
    var next = movPromises.splice(0,1)
    console.log('before')
    console.log(movPromises)
    console.log('next')
    console.log(next)
    if (next) {
      loop(next)
    } else {
      console.log('done')
      process.exit()
    }
  });*/
}

var compile = function compilePromises(file) {
  var deferred = Q.defer();
  //return _.map([items], function(file){ 
    
    //var media = file.split('.')[0]
    //file = escape(file)
    var ext = file.split('.').pop(); 
    var media = file.replace(/\.[^/.]+$/, "")
    
    var full_path_source = parentPath + '/../' + path + '/' + media + '.' + ext
    //var esp_path = escape(media)
    //var renamed_path_source = parentPath + '/../' + path + '/' + esp_path + '.' + ext
    var full_path_destination = parentPath + '/../' + path + '/converted/' + media + '.mp4'
    
    /*mv(full_path_source, renamed_path_source, function(err) {
      // done. it tried fs.rename first, and then falls back to 
      // piping the source file to the dest file and then unlinking 
      // the source file. 
      
      //Rename path with special characters to path without special characters
      //rename(full_path_source, renamed_path_source)
      
      if (err) {
        deferred.reject(err)
      }
      
      var full_path_destination = parentPath + '/../' + path + '/converted/' + esp_path + '.mp4'
      
      console.log(full_path_source)
      console.log(renamed_path_source)
      console.log(full_path_destination)
      
      return deferred.resolve(vidPRomise(full_path_source, full_path_destination))
    });*/
    
  return vidPRomise(full_path_source, full_path_destination)
  //});
}

var tasks = []

var path = process.argv[2];
var groups = process.argv[3];

fs.readdir(path, function(err, items) {
    
  console.log(items)
  
    for (var i = 0; i < items.length; i++ /*=parseInt(groups)*/) {
      /*var temp = []
      for (var k = 0; k < groups; k++) {
        var file = items[k + i]
        console.log(file)
        if ((i + k) < items.length && file.indexOf('.') > 0){
          temp.push(file)
        }
      }
      if (temp.length > 0) { 
        tasks.push(temp)
      }*/
      if (i < items.length && items[i].indexOf('.') > 0){
        tasks.push(items[i])
      }
    }

    console.log(tasks)
    
    loop(tasks)
});