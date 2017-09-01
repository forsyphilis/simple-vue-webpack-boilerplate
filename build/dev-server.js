let express = require('express')
let devMiddleware = require('webpack-dev-middleware')
let hotMiddleware = require('webpack-hot-middleware')
let webpack = require('webpack')
let webpackDevConfig = require('../config/webpack.dev.conf')
let morgan = require('morgan')
let compiler = webpack(webpackDevConfig)
let path = require('path')

devMiddleware = devMiddleware(compiler, {
    publicPath: webpackDevConfig.output.publicPath,
    quiet: true
})
hotMiddleware = hotMiddleware(compiler, {
    log: false,
    heartbeat: 2000
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

let app = express()

app.use(devMiddleware)
app.use(hotMiddleware)
app.use(morgan('combined'))

let staticPath = path.posix.join('/', 'static')
app.use(staticPath, express.static('./static'))


let _resolve
let readyPromise = new Promise(resolve => {
    _resolve = resolve
})


console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at 8088\n')
    _resolve()
})


let server = app.listen(8088)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}
