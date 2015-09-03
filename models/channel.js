var mongoose = require('mongoose')

var channelSchema = new mongoose.Schema({
	name: { type: String, required: true, index: true },
	position: { type: Number },
	media: [
    {
      type: mongoose.Schema.Types.Mixed,
      mediaId: String, /* Usually the imdb id for specific*/
      type: String /* general or specific. More later. Maybe youtube or something */
    }
  ],
	created: { type: Date, default: Date.now },
	__v: { type: Number, select: false },
})

module.exports = mongoose.model('channel', channelSchema)
