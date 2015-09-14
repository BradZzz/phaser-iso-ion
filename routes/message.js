var Message = require('../models/message')

module.exports = function (app) {
  var apicache = require('apicache').options({ debug: !app.get('prod') })
  var cache    = apicache.middleware

  app.get('/api/v1/messages/test', cache(), function (req, res) {
    console.log('here')
    res.status(200).json({'some':'here'})
  })
    
  app.get('/api/v1/messages', cache(), function (req, res) {
    req.apicacheGroup = req.query.category

    var offset = +(req.query.offset || 0)
    var limit  = Math.min(25, +(req.query.limit || 10))
    var sort   = req.query.sort || 'created'

    Message.find({
      category: req.query.category
    }).skip(offset)
      .limit(limit)
      .sort(sort)
      .exec(function (err, messages) {
        if (err) {
          console.error(err)
          return res.status(500).json({ debug: err })
        } else {
          res.status(200).json(messages)
        }
      })
  })

  // only allow mutating routes on localhost
  //if (!app.get('prod')) {
    app.delete('/api/v1/messages', function (req, res) {
      Message.remove({
        _id: req.query.id
      }, function (err) {
        if (err) {
          console.error(err)
          return res.status(500).json({ debug: err })
        } else {
          apicache.clear(req.query.category)
          res.status(200).send()
        }
      })
    })

    app.post('/api/v1/messages', function (req, res) {
      var id = req.body.message._id

      if (id) {
        delete req.body.message._id

        // update
        Message.findOneAndUpdate({
          _id: id
        }, req.body.message, { upsert: true }, function (err, message) {
          if (err) {
            console.error(err)
            return res.status(500).json({ debug: err })
          } else {
            apicache.clear(req.body.message.category)
            res.status(200).json(message)
          }
        })
      } else {
        // create
        Message.create(req.body.message, function (err, message) {
          if (err) {
            console.error(err)
            return res.status(500).json({ debug: err })
          } else {
            apicache.clear(req.body.message.category)
            res.status(200).json(message)
          }
        })
      }
    })
  //}
}
