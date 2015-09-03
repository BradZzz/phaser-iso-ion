var mongoose = require('mongoose')

var mediaSchema = new mongoose.Schema({
	name: { type: String, required: true, index: true },
	poster: {type: String},
	plot: {type: String},
	rated: {type: String},
	path: {type: String, required: true},
	type: {type: String, required: true},
	genre: [{ type: String },],
	episodes: [{ type: String },],
	runtime: { type: String },
	imdbRating: { type: Number },
	imdbId: { type: String },
	year: { type: String },
	created: { type: Date, default: Date.now },
	__v: { type: Number, select: false },
})

module.exports = mongoose.model('media', mediaSchema)
