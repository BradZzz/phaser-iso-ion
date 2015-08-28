#!/usr/bin/env node

// script meant for bootstrapping messages collection
require('dotenv').load()

var mongoose = require('mongoose')
var Message  = require('../models/message')
var async    = require('async')

var fs = require('fs')
var path = require('path')
var _    = require('underscore')

mongoose.connect(process.env.MONGODB)

var base = path.join(__dirname, 'messages')
var numMessagesCreated = 0

async.eachLimit(fs.readdirSync(base), 2, function (file, cb) {
  if (!endsWith(file, '.json')) return cb()

  var data = JSON.parse(fs.readFileSync(path.join(base, file), 'utf-8'))

  console.log("bootstrapping", "'" + data.category + "'", "messages")

  // remove all messages currently belonging to this category
  Message.remove({
    category: data.category
  }, function (err) {
    if (err) return cb(err)

    var messages = _.shuffle(data.messages)

    // create all new messages for this category in a randomized order
    async.eachLimit(messages, 4, function (message, cb) {
      Message.create(_.extend({
        category: data.category
      }, message), cb)
    }, function (err) {
      if (!err) {
        console.log("inserted", messages.length, "'" + data.category + "'", "messages")
        numMessagesCreated += messages.length
      }

      cb(err)
    })
  })
}, function (err) {
  if (err) {
    console.error("error bootstrapping messages", err)
  } else {
    console.log("done bootstrapping", numMessagesCreated, "messages total")
  }

  process.exit(!!err)
})

function endsWith (str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1
}
