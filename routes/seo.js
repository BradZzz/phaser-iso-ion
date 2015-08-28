var prerender = require('prerender-node')

module.exports = function (app) {
  prerender.set('prerenderServiceUrl', process.env.PRERENDER_SERVICE_URL)
  app.use(prerender)
}
