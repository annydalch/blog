'use strict'

const path = require('path')
const fs = require('fs')
const pug = require('pug')

let pages = null
let mainStyle = null
let blogPages = null
let backwardsBlogPages = null
let nPages = 0

let viewPath = path.join(__dirname, '..', 'views')

let about = pug.compileFile(path.join(viewPath, 'about.pug'))

fs.readFile(path.join(viewPath, 'style', 'main.css'), (err, text) => {
  if (err) throw err
  mainStyle = text
})

fs.readFile(path.join(viewPath, 'blogposts.json'), (err, text) => {
  if (err) throw err
  blogPages = JSON.parse(text)
  nPages = blogPages.length
  for (let i = 0; i < nPages; i++) {
    let page = blogPages[i]
    page.index = i
    if (i > 0) {
      page.older = { index: i - 1, title: blogPages[i - 1].title }
    }
    if (i < (nPages - 1)) {
      page.newer = { index: i + 1, title: blogPages[i + 1].title }
    }
    page.compiled = pug.compileFile(path.join(viewPath, page.file))
  }
  backwardsBlogPages = blogPages.slice().reverse()
})

fs.readFile(path.join(viewPath, 'pages.json'), (err, text) => {
  if (err) throw err
  pages = JSON.parse(text)
})

module.exports = (app) => {
  app.get('/', (req, res) => {
    let page = blogPages[blogPages.length - 1]
    let config = buildConfig(req, null, page)
    res.send(page.compiled(config))
  })

  app.get('/about', (req, res) => {
    res.send(about(buildConfig(req, 'About')))
  })

  app.get('/style/main.css', (req, res) => {
    res.type('css')
      .send(mainStyle)
  })

  app.get('/blog/:index', (req, res) => {
    let i = parseInt(req.params.index)
    if (i >= nPages) {
      res.sendStatus(404)
    } else if (i === (blogPages.length - 1)) {
      res.redirect('/')
    } else {
      let page = blogPages[i]
      let config = buildConfig(req, null, page)
      res.send(page.compiled(config))
    }
  })
}

let buildConfig = (req, activePage, page) => {
  let config = {}
  if (pages != null) {
    config.pages = pages
  }
  if (blogPages != null) {
    config.blogPages = backwardsBlogPages
  }
  if (page) {
    config.newer = page.newer
    config.older = page.older
    config.title = page.title
    config.date = page.date
  }
  config.activePage = activePage
  return config
}
