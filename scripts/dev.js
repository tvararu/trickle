const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../webpack.config.dev')

const app = express()
const compiler = webpack(config)

const indexhtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Trickle.</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no">
  </head>
  <body>
    <div id="root">
    </div>
    <script src="/static/bundle.js"></script>
  </body>
</html>
`

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.get('*', (req, res) => {
  res.send(indexhtml)
})

app.listen(3000, 'localhost', (err) => {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://localhost:3000')
})
