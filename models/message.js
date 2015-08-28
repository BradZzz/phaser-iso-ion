var mongoose = require('mongoose')

var MessageSchema = new mongoose.Schema({
  category: { type: String, required: true, index: true },
  disabled: { type: Boolean, default: false, index: true },

  media: { type: String },
  text: { type: String },

  created: { type: Date, default: Date.now },

  __v: { type: Number, select: false }
})

module.exports = mongoose.model('Message', MessageSchema)
