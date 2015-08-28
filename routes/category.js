var Category = require('../models/category')
var Message  = require('../models/message')
var async    = require('async')

module.exports = function (app) {
  var apicache = require('apicache').options({ debug: !app.get('prod') }).middleware

  app.get('/api/v1/categories', apicache(), function (req, res) {
    var offset = +(req.query.offset || 0)
    var limit  = Math.min(100, +(req.query.limit || 25))

    Category.find({
      disabled: { '$ne': true },
    }).skip(offset)
      .limit(limit)
      .exec(function (err, results) {
        if (err) {
          console.error(err)
          return res.status(500).json({ debug: err })
        } else {
          results = results.map(function (r) { return r.toObject() })

          async.eachLimit(results, 4, function (category, cb) {
            Message.find({
              category: category.slug
            }).limit(10)
              .exec(function (err, messages) {
                if (messages) {
                  category.messages = messages
                }

                cb(err)
              })
          }, function (err) {
            if (err) {
              console.error(err)
              return res.status(500).json({ debug: err })
            } else {
              res.status(200).json(results)
            }
          })
        }
      })
  })

  app.get('/api/v1/category', function (req, res) {
    var slug = req.query.slug

    Category.findOne({
      slug: slug
    }, function (err, result) {
      if (err) {
        console.error("error finding category", slug, err)
        return res.status(500).json({ debug: err })
      } else if (!result) {
        return res.status(404).json({ debug: "category " + slug + " not found" })
      } else {
        res.status(200).json(result)
      }
    })
  })
}
