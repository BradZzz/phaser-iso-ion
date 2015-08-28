var mongoose = require('mongoose')
var mms = require('../lib/mms')

var OrderSchema = new mongoose.Schema({
  // category of messages to send
  category: { type: String, required: true, index: true },

  // recipient's phone number
  toNumber: { type: String, required: true },

  // recipient's name
  toName: { type: String },

  // twilio number to send from
  fromNumber: { type: String },

  // sender's name
  fromName: { type: String, required: true },

  // optional initial message
  hasCustomMessage: { type: Boolean, default: false },
  customMessage: { type: String },

  // number of total messages to send
  size: { type: Number, required: true },

  // duration inbetween messages in seconds
  interval: { type: Number, required: true },

  // price sender paid in USD cents
  price: { type: Number, required: true },

  // platform this order was created from
  // enum {
  //   'browser',  // stripe
  //   'ios',      // in-app purchase
  //   'android'   // in-app purchase
  // }
  platform: { type: String },

  // number of messages sent successfully
  sentSuccess: { type: Number, default: 0 },

  // number of messages that failed to send
  sentError: { type: Number, default: 0 },

  // array of messages sent
  messages: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Message' } ],

  // date of last message sent successfully
  lastSent: { type: Date, default: Date.now },

  // enum {
  //   'active',
  //   'complete',
  //   'error'
  // }
  status: { type: String, default: 'active', index: true },

  // id of charge responsible for this order
  // type depends on platform (stripe orders on the web and in-app purchases on native)
  charge: { type: String },

  created: { type: Date, default: Date.now },

  __v: { type: Number, select: false }
})

module.exports = mongoose.model('Order', OrderSchema)
