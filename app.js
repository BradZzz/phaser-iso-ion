#!/usr/bin/env node

require('dotenv').load()

var errorhandler = require('errorhandler')
var express      = require('express')
var exphbs       = require('express-handlebars')
var path         = require('path')
var logger       = require('morgan')
var mongoose     = require('mongoose')
var compression  = require('compression')
var bodyParser   = require('body-parser')
var utils        = require('./lib/utils')
var app          = module.exports = express()

var TOKEN_SECRET = process.env.TOKEN_SECRET || 'dotdashdot-cast'

mongoose.connect(process.env.MONGODB)

app.disable('x-powered-by')
app.set('port', process.env.PORT || 3000)
app.set('prod', utils.isProd())
app.set('TOKEN_SECRET', TOKEN_SECRET)

app.use(compression())
app.use('/assets', express.static('assets'))
app.use('/build', express.static('dist/build'))

var templateConfig = {
  defaultLayout: false,
  extname: '.html',
}

if (app.get('prod')) {
  console.log('is prod!')
  templateConfig.partialsDir = path.join(__dirname, 'dist')
} else {
  console.log('is not prod!')
  templateConfig.partialsDir = __dirname
}

app.engine('html', exphbs(templateConfig))
app.set('view engine', 'html')
app.set('views', templateConfig.partialsDir)

// TODO: disable CORS on prod
app.all('*', function (req, res, next) {
  if (!req.get('Origin')) return next()
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Length, Content-Type')
  if ('OPTIONS' === req.method) return res.send(200)
  next()
})

app.use(require('cookie-parser')())

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

if (app.get('prod')) {
  app.use(logger())
} else {
  mongoose.set('debug', true)
  app.use(errorhandler())
  app.use(logger('dev'))
}

// setup routes
require('./routes/cast')(app)
require('./routes/user')(app)
require('./routes/seo')(app)
require('./routes/order')(app)
require('./routes/message')(app)
require('./routes/category')(app)
require('./routes/views')(app)

app.listen(app.get('port'), function () {
  console.log("Express listening at localhost:" + app.get('port'))
})
