var utils = require('./utils')
var isProd = utils.isProd()

module.exports = {
  STRIPE_SECRET_KEY: isProd ? process.env.STRIPE_SECRET_KEY_LIVE : process.env.STRIPE_SECRET_KEY_TEST,
  STRIPE_PUBLIC_KEY: isProd ? process.env.STRIPE_PUBLIC_KEY_LIVE : process.env.STRIPE_PUBLIC_KEY_TEST
}
