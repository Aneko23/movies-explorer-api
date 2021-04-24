const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const BadRequestError = require('../error/bad-request-error');
const UnauthorizedError = require('../error/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    if (err.name === 'UnauthorizedError') {
      next(new UnauthorizedError('Id пользователя введён неверно'));
    } else if (err.message === 'jwt malformed') {
      next(new BadRequestError('Токен передан неверно'));
    } else {
      next(err);
    }
  }

  req.user = payload;
  next();
};
