var mongoose = require('mongoose')

var Assets = mongoose.model('Assets', {
  version: { type: Number, default: 0 }
})

module.exports = Assets
