#!/usr/bin/env node

require('dotenv').load()

var mongoose = require('mongoose')
var Assets   = require('../models/assets')

mongoose.connect(process.env.MONGODB)

Assets.findOne({}, function (err, assets) {
  if (err) {
    console.error(err)
    return process.exit(1)
  }

  console.log(assets.version)
  process.exit(0)
})
