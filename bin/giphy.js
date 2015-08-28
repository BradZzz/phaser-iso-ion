#!/usr/bin/env node

// script meant for initializing a category of messages from giphy search
require('dotenv').load()

var mongoose = require('mongoose')
var Category = require('../models/category')
var Message  = require('../models/message')

var giphy    = require('giphy-wrapper')('dc6zaTOxFJmzC')
var async    = require('async')

mongoose.connect(process.env.MONGODB)

if (process.argv.length < 4) {
  console.log("invalid params; giphy [query] [category] [limit]")
  process.exit(1)
}

var query    = process.argv[2]
var category = process.argv[3]
var limit    = process.argv[4] || 100

Category.remove({ slug: category }, function (err) {
  if (err) {
    console.error("error removing old category", category, err)
    process.exit(1)
  } else {
    console.log("removed category '" + category + "'")

    Category.create({
      slug: category,
      title: category,
      query: query,
      logo: "",
      subtitle: ""
    }, function (err) {
      if (err) {
        console.error("error creating category", category, err)
        process.exit(1)
      } else {
        console.log("created category '" + category + "'")

        giphy.search(query, limit, 0, function (err, response) {
          if (err) {
            console.error("giphy search error", err)
            process.exit(1)
          } else {
            // remove all old messages for this category
            Message.remove({ category: category }, function (err) {
              if (err) {
                console.error("error removing old category messages", err)
                process.exit(1)
              } else {
                console.log("removed all messages for category '" + category + "'")

                async.eachLimit(response.data, 4, function (result, cb) {
                  var media = result.images.original.url

                  if (!media) {
                    cb("no image found for result", result)
                  } else {
                    Message.create({
                      category: category,
                      media: media
                    }, cb)
                  }
                }, function (err) {
                  if (err) {
                    console.error(err)
                    process.exit(1)
                  } else {
                    console.log("populated category '" + category + "' with", response.data.length, "messages")
                    process.exit(0)
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})
