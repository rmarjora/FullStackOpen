require('express-async-errors')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: `🔥 ${error.message}` });
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique'})
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expred'
    })
  }

  console.error(error.message);
  return res.status(500).json({ error: 'internal server error' });
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};