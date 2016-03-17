

/***
nasdaq stocks
http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download
nyse stocks
http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NYSE&render=download
asx stocks
http://www.asx.com.au/asx/research/ASXListedCompanies.csv
***/

var csv  = require('fast-csv')
var fs   = require('fs')
var Q    = require('q')
var finance = require('yahoo-finance')
var moment = require('moment')

var nasdaq = fs.createReadStream("./stock_csv/nasdaq.csv")
var nyse = fs.createReadStream("./stock_csv/nyse.csv")
var asx = fs.createReadStream("./stock_csv/asx.csv")

module.exports = function (app) {

  app.get('/stock', function (req, res){
    console.log(req.query)
    if ('sym' in req.query) {
        var start = 'start' in req.query ? req.query.start : moment().subtract(6, 'months').format('YYYY-MM-DD')
        var end = 'end' in req.query ? req.query.end : moment().format('YYYY-MM-DD')
        var period = 'period' in req.query ? req.query.period : 'w'

        console.log(start)
        console.log(end)

        finance.historical({
          symbol: req.query.sym,
          from: start,
          to: end,
          period: period,
        }, function (err, quotes) {
          console.log(err)
          console.log(quotes)
          return res.status(200).json(quotes)
        })
    } else {
        return res.status(400).json("Bad Request")
    }
  })

  app.get('/stocks/list', function(req, res) {

    var exchangeNASDAQ = getStockStream(nasdaq, "nasdaq")
    var exchangeNYSE = getStockStream(nyse, "nyse")

    var exchanges = [exchangeNASDAQ, exchangeNYSE]

    Q.all(exchanges).then(function(gResp){
        console.log("finished")
        console.log(gResp)
        return res.status(200).json(gResp)
    }, function (err){
        console.log("error")
        console.log(err)
    })
  });

  function getStockStream(stream, exchange){
    var deferred = Q.defer()
    var builder = { name : exchange, data : []}

    var csvStream = csv().on("data", function(data){
       console.log('data')
       console.log(data)

       if (data.length > 0 && data[0].trim().toLowerCase() != 'symbol') {
         builder.data.push(data[0].trim())
       }
    }).on("end", function(){
       console.log("done : " + exchange)
       deferred.resolve(builder)
    })

    stream.pipe(csvStream)

    return deferred.promise
  }

}
