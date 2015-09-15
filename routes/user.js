var User         = require('../models/user')
var Q            = require('q')
var crypto       = require('crypto')
var _            = require('underscore')
var omdbApi      = require('omdb-client')
var mongoose     = require('mongoose')
var storage      = require('node-persist')
var hat          = require('hat')
var moment       = require('moment');
var rack = hat.rack();
var ObjectId = mongoose.Types.ObjectId
var return_count = 0

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

module.exports = function (app) {
  
  storage.initSync()
  
  function getHash(pass){
    return crypto.createHash("sha1").update(pass).digest('hex')
  }
  
  function validateToken(user){
    var deferred = Q.defer()
    //The user object should contain an email, role, and an associated token
    storage.getItem(user.token, function (err, value) {
     if (value && user.auth === value.email && moment(new moment().format()).isAfter(value.expires)) {
       console.log(user)
       console.log(value)
       //refresh token
       storage.removeItem(user.token, function(err){
         if (err) {
           deferred.reject('error refreshing token')
         }
         deferred.resolve({
           auth : user.auth,
           token : generateToken(value),
           role : user.role
         })
       })
     } else {
       deferred.reject('invalid token')
     }
    })
    return deferred.promise
  }

  function generateToken(user) {
    //Create a token key with value user
    var cache = {
      email : user.email,
      pass : user.pass,
      role : user.role,
      expires : new moment().add(1, 'h').format()
    }
    var id = rack(cache)
    console.log('generating')
    console.log(cache)
    storage.setItem(id, cache)
    return id
  }
  
  app.get('/api/v1/user/validate', function (req,res) {
    validateToken(req.query).then(function(id,err){
      if (err) {
        console.log(err)
        return res.status(500).json({ debug: err })
      } else {
        return res.status(200).json(id)
      }
    })
  })
  
  app.get('/api/v1/user/login', function (req,res) {
    if (req.query && 'pass' in req.query && 'email' in req.query) {
      var hash = getHash(req.query.pass)
      var query = { 'email' : req.query.email, 'pass' : hash }
      User.findOne(query).exec(function (err, user) {
        if (err || !user){
          return res.status(401).json({ debug: err })
        } else {
          return res.status(200).json({
            auth : user.email,
            token : generateToken(user),
            role : user.role
          })
        }
      })
    }
  })
  
  app.post('/api/v1/user/register', function (req,res) {
    if (req.query && 'pass' in req.query && 'email' in req.query) {
      req.query.role = 'role' in req.query ? req.query.role : 1
      req.query.pass = getHash(req.query.pass)
      var query = { 'email' : req.query.email }
      User.findOneAndUpdate(query, req.query, {upsert:true}, function(err){
        if (err) {
          console.log(err)
          return res.status(500).json({ debug: err })
        } else {
          return res.status(200).json()
        }
      })
    } else {
      return res.status(400).json({ debug: 'Invalid parameters' })
    }
  })
}
