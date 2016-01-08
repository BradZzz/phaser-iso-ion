'use strict';

var fs = require('fs');
var ffmpeg = require('ffmpeg');
var Q = require('q');
var _ = require('underscore')

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
    
    console.log('Path: ' + path)
    console.log('Dest: ' + dest)
    
    // Video metadata
    console.log(video.metadata);
    // FFmpeg configuration
    console.log(video.info_configuration);
    //ffmpeg -i 413.mp4 -acodec libfaac -vcodec libx264 -profile:v baseline -level 3.0 converted/413.mp4
    video.addCommand('-acodec', 'libfaac');
    video.addCommand('-vcodec', 'libx264')
    video.addCommand('-profile:v', 'baseline')
    video.addCommand('-level', '3.0');
    video.save(dest, function (err, file) {
      
      console.log(err)
      console.log(file)
      
      if (!err) {
        console.log('finished: ' + file)
        deferred.resolve(file);
      } else {
        console.log('err: ' + file)
        deferred.reject('Error: ' + err);
      }
    });
  }, function (err) {
    console.log('err: ' + file)
    deferred.reject('Error: ' + err);
  });
  } catch (err) {
    console.log(err)
  }
  
  return deferred.promise;
}

var loop = function (movPromises) {
  var raw = movPromises[0]
  
  console.log('Converting batch: ' + raw)
  
  var promises = compile(raw)
  
  Q.all(promises).then(function (results) {
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
  });
}

var compile = function compilePromises(items) {
  return _.map(items, function(file){ 
    
    var media = file.split('.')[0]
    var full_path_source = parentPath + '/../' + path + '/' + file
    var full_path_destination = parentPath + '/../' + path + '/converted/' + media + '.mp4'
    
    return vidPRomise(full_path_source, full_path_destination)
  });
}

var tasks = []

var path = process.argv[2];
var groups = process.argv[3];

fs.readdir(path, function(err, items) {
    
  console.log(items)
  
    for (var i = 0; i < items.length; i+= parseInt(groups)) {
      var temp = []
      for (var k = 0; k < groups; k++) {
        var file = items[k + i]
        console.log(file)
        if ((i + k) < items.length && file.indexOf('.') > 0){
          temp.push(file)
        }
      }
      if (temp.length > 0) { 
        tasks.push(temp)
      }
    }

    console.log(tasks)
    
    loop(tasks)
});