'use strict'

const path = require('path')
const fs = require('fs')
const pug = require('pug')

let pages = null
let mainStyle = null

let viewPath = path.join(__dirname, '..', 'views')

// let about = pug.compileFile(path.join(viewPath, 'about.pug'))

fs.readFile(path.join(viewPath, 'style', 'main.css'), (err, text) => {
  if (err) throw err
  mainStyle = text
})

fs.readFile(path.join(viewPath, 'pages.json'), (err, text) => {
  if (err) throw err
  pages = JSON.parse(text)
})

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('index.pug', buildConfig(req, 'Home'))
  })

  /*app.get('/about', (req, res) => {
    res.send(about(buildConfig(req, 'About')))
  })*/
  app.get('/dummy', (req, res) => {
    res.render('dummypost.pug', buildConfig(req, 'Dummy Page'))
  })

  app.get('/style/main.css', (req, res) => {
    res.type('css')
      .send(mainStyle)
  })
}

let buildConfig = (req, activePage) => {
  let config = {}
  if (pages != null) {
    config.pages = pages
  }
  config.activePage = activePage
  return config
}
