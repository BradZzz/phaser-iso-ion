var mongoose = require('mongoose')

var likeSchema = new mongoose.Schema({
	id: { type: String, required: true, index: true }, //This is the imdb id
	ep: { type: String, required: true }, //The ep, if applicable
	like: { type: Number, required: true }, //This is where it was tagged
	by: { type: String, required: true }, //This is who tagged it. prob email
	created: { type: Date, default: Date.now },
	__v: { type: Number, select: false },
})

module.exports = mongoose.model('like', likeSchema)
