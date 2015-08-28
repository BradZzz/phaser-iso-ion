var Order     = require('../models/order')
var mms       = require('../lib/mms')
var scheduler = require('node-schedule')
var once      = require('once')

var schedule = module.exports = {
  init: function (cb) {
    var count = 0
    cb = once(cb)

    Order.find({ status: 'active', category: { '$ne': 'test' } }).stream()
      .on ('error', function (err) {
        console.error("error initializing order schedule", err)
        cb(err)
      })
      .on ('data', function (order) {
        ++count
        schedule.queue(order)
      })
      .on ('close', function () {
        cb(null, count)
      })
  },

  queue: function (order) {
    if (order.status !== 'active') return

    var rule = new scheduler.RecurrenceRule()
    rule.seconds = order.interval

    var j = null

    function sendMessage () {
      mms.sendMessage(order, function (err, data) {
        if (data.status !== 'active') {
          if (j) j.cancel()
        } else if (!j) {
          // schedule remaining messages to be sent
          j = scheduler.scheduleJob(rule, sendMessage)
        }
      })
    }

    // send first message immediately
    sendMessage()
  }
}
