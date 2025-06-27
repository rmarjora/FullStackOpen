require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { errorHandler, tokenExtractor, requestLogger } = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.static('../bloglist-frontend/dist'))
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  logger.info('Running in test mode, using testing router')
  app.use('/api/testing', testingRouter)
}

app.use(errorHandler)

module.exports = app