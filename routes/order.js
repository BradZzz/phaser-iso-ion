var Order    = require('../models/order')
var mms      = require('../lib/mms')
var schedule = require('../lib/schedule')
var conf     = require('../lib/conf')

module.exports = function (app) {
  var stripe = require('stripe')(conf.STRIPE_SECRET_KEY)

  // only initialize the order scheduler if we're on prod OR if we're
  // specifically testing the scheduler locally
  if (app.get('prod') || process.env.TEST_SCHEDULE) {
    schedule.init(function (err, count) {
      if (err) {
        console.error("error initializing order schedule", err)
      } else {
        console.log("initialized", count, "orders")
      }
    })
  }

  app.post('/api/v1/orders', function (req, res) {
    var requiredParams = [
      'category',
      'toNumber',
      'fromName',
      'size',
      'interval',
      'price',
      'platform'
    ]

    // basic parameter validation
    for (var i = 0; i < requiredParams.length; ++i) {
      var param = requiredParams[i]

      if (!req.body[param]) {
        console.error("error missing required request param", param, req.body)
        return res.status(400).json({ message: "Missing required request param '" + param + "'" })
      }
    }

    if (req.body.platform === 'browser') { // stripe order
      if (!req.body.token) {
        console.error("error missing required stripe token")
        return res.status(400).json({ message: "Missing required stripe token" })
      }

      stripe.charges.create({
        currency: "usd",
        amount: req.body.price,
        source: req.body.token,
        description: req.body.desc || ("TEST " + req.body.size + " blast mms messages")
      }, function (err, charge) {
        if (err) {
          console.error("error creating stripe charge", err)
          return res.status(402).json({ type: err.type })
        } else {
          createOrder(null, charge.id)
        }
      })
    } else { // native in-app purchase order
      if (!req.body.transactionId) {
        console.error("error missing required in-app purchase transactionId")
        return res.status(400).json({ message: "Missing required in-app purchase transactionId" })
      }

      createOrder(null, req.body.transactionId)
    }

    function createOrder (err, charge) {
      var params = {
        charge: charge,
        category: req.body.category,
        toNumber: req.body.toNumber,
        fromName: req.body.fromName,
        fromNumber: mms.getRandomNumber(),
        hasCustomMessage: req.body.hasCustomMessage,
        customMessage: req.body.customMessage,
        size: req.body.size,
        interval: req.body.interval,
        price: req.body.price,
        platform: req.body.platform
      }

      if (req.body.toName) {
        params.toName = req.body.toName
      }

      Order.create(params, function (err, order) {
        if (err) {
          console.error(err)
          return res.status(500).json({ debug: err })
        } else {
          // send a welcome message
          mms.send(order, {
            text: "This is a text blast from your friend " + order.fromName + "! You may reply STOP at any point to opt out of the service. See https://textblast.io for more info."
          }, function (err) {
            if (err) {
              console.error("MMS error sending welcome message", order._id, err)
            }

            if (order.hasCustomMessage && order.customMessage && order.customMessage.length > 0) {
              // send a custom intro message if the order calls for one
              mms.send(order, {
                text: order.customMessage
              }, function (err) {
                if (err) {
                  console.error("MMS error sending custom message", order._id, err)
                }

                // queue the order's messages and return successfully
                schedule.queue(order)
                res.status(200).send()
              })
            } else {
              // queue the order's messages and return successfully
              schedule.queue(order)
              res.status(200).send()
            }
          })
        }
      })
    }
  })
}
