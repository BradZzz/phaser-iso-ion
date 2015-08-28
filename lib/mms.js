var Order   = require('../models/order')
var Message = require('../models/message')

var twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID,
                               process.env.TWILIO_AUTH_TOKEN)

var mms = module.exports = {
  numbers: process.env.TWILIO_NUMBERS.split(','),

  getRandomNumber: function () {
    return mms.numbers[Math.random() * mms.numbers.length | 0]
  },

  // finds an appropriate message to send for the given order and attempts to
  // send it via MMS, updating the order appropriately.
  sendMessage: function (order, cb) {
    function handleError (err) {
      order.sentError += 1

      if (order.sentSuccess + order.sentError >= order.size * 2) {
        // bail on processing this order if we've attempted too many messages
        order.status = 'error'
      }

      order.save(function (err2) {
        if (err2) {
          console.error("error saving error for order", order._id, err2)
        }

        cb(err, order)
      })
    }

    // find a set of candidate messages with the right category that have not
    // already been sent for this order.
    Message.find({
      category: order.category,
      disabled: false,
      _id: { '$nin': order.messages },
    }).limit(10)
      .sort({ created: -1 })
      .exec(function (err, docs) {
        if (err || !docs) {
          console.error("error finding message for order", order._id, err)

          handleError(err)
        } else {
          // choose a random message from the candidate set
          var message = docs[Math.floor(Math.random() * docs.length)]

          mms.send(order, message, function (err) {
            if (err) {
              console.error("error sending message", message._id, "for order", order._id, err)
              handleError(err)
            } else {
              order.sentSuccess += 1
              order.messages.push(message._id)
              order.lastSent = new Date()

              if (order.sentSuccess >= order.size) {
                order.status = 'complete'
              }

              order.save(cb)
            }
          })
        }
      })
  },

  // send a single message via SMS/MMS for the given order
  send: function (order, message, cb) {
    var params = {
      to: order.toNumber,
      from: order.fromNumber || mms.getRandomNumber()
    }

    if (message.text && message.text.length > 0) {
      params.body = message.text
    }

    if (message.media && message.media.length > 0) {
      params.mediaUrl = message.media
    }

    if (!(params.mediaUrl || params.body)) {
      var msg = "error cannot send invalid empty message"
      console.error(msg, message)
      return cb(msg)
    }

    twilio.messages.post(params, cb)
  }
}
