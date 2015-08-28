#!/usr/bin/env node

// script meant for testing the order scheduler
require('dotenv').load()

var mongoose = require('mongoose')
var Schedule = require('../lib/schedule')

mongoose.connect(process.env.MONGODB)

Schedule.init(function (err, count) {
  if (err) {
    console.error("error initializing order schedule", err)
    process.exit(1)
  } else {
    console.log("initialized", count, "orders")

    if (count <= 0) {
      process.exit(0)
    }
  }
})
