'use strict'

const express = require('express')
const morgan = require('morgan')

const app = express()
const port = process.env.PORT || 8080

app.use(morgan('dev'))
app.set('view engine', 'pug')

require('./app/routes.js')(app)

app.listen(port)
console.log(`listening on port ${port}`)

process.on('SIGTERM', () => process.exit(0))

process.on('SIGABRT', () => process.exit(0))

process.on('SIGINT', () => process.exit(0))

process.on('SIGQUIT', () => process.exit(0))
