var mongoose = require('mongoose')

var channelSchema = new mongoose.Schema({
	name: { type: String, required: true, index: true },
	position: { type: Number },
	general: [
     {
       type: mongoose.Schema.Types.Mixed,
     }
  ],
	specific: [
    {
      type: mongoose.Schema.Types.Mixed,
    }
  ],
  lastId: { type: String }, //Last media watching
  lastEp: { type: String }, //Last media episode, if applicable
  lastMediaCurrent: { type: Number, default: 0 }, //The number of seconds into media when channel changed
  lastMediaDuration: { type: Number, default: 0 }, //The number of seconds the current media last
  lastOffset: { type: Date }, //The last time the channel was watched
	created: { type: Date, default: Date.now },
	__v: { type: Number, select: false },
})

module.exports = mongoose.model('channel', channelSchema)
