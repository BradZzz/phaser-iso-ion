var mobileDetect = require('mobile-detect')
var conf = require('../lib/conf')
var path = require('path')

module.exports = function (app) {
  var blacklist = {
    'png': true,
    'jpg': true,
    'jpeg': true,
    'js': true,
    'css': true,
    'woff': true,
    'otf': true,
    'ttf': true,
    'eot': true
  }

  if (app.get('prod')) {
    // redirect all http traffic to https
    app.use(function (req, res, next) {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(['https://', req.get('Host'), req.url].join(''))
      } else {
        next()
      }
    })
  }

  app.get(/^[a-zA-Z0-9_\/-]*/, function (req, res) {
    var ext = path.extname(req.path).substring(1).toLowerCase()

    if (ext in blacklist) {
      res.sendStatus(404)
    } else {
      var subdomain = req.subdomains[0]
      if (subdomain === 'www') subdomain = undefined

      var md = new mobileDetect(req.headers['user-agent'])
      /*var params = {
        isMobile: !!md.mobile(),
        stripePublicKey: conf.STRIPE_PUBLIC_KEY,
        category: subdomain
      }
      params.category = subdomain*/
      var params = {}
      
      res.render('index', params)
    }
  })
}
