var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  pass: {type: String, required: true },
  role: { type: Number, default: 1 },
	created: { type: Date, default: Date.now },
	__v: { type: Number, select: false },
})

module.exports = mongoose.model('user', userSchema)
