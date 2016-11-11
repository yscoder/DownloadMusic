var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var config = require('./webpack.dev.conf')
var routes = require('./routes')
    // var proxyMiddleware = require('http-proxy-middleware')

var app = express()
var compiler = webpack(config)

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// var proxyTable = {
//   // '/api': {
//   //   target: 'http://jsonplaceholder.typicode.com',
//   //   changeOrigin: true,
//   //   pathRewrite: {
//   //     '^/api': ''
//   //   }
//   // }
// }

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    stats: {
        colors: true,
        chunks: false
    }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
    // force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// proxy api requests
// Object.keys(proxyTable).forEach(function (context) {
//   var options = proxyTable[context]
//   if (typeof options === 'string') {
//     options = { target: options }
//   }
//   app.use(proxyMiddleware(context, options))
// })

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
app.use('/src', express.static('./src'))

routes(app)

module.exports = app.listen(8080, function(err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:8080'
    console.log('Listening at ' + uri + '\n')
    opn(uri)
})
