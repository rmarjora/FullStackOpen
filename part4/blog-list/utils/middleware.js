require('express-async-errors')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: `🔥 ${error.message}` });
  }

  console.error(error.message);
  res.status(500).json({ error: 'internal server error' });
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};