var mongoose = require('mongoose')

var channelSchema = new mongoose.Schema({
	name: { type: String, required: true, index: true },
	position: { type: Number },
	media: [{ type: String },],
	created: { type: Date, default: Date.now },
	__v: { type: Number, select: false },
})

module.exports = mongoose.model('channel', channelSchema)
