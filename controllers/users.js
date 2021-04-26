const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../error/not-found-error');
const BadRequestError = require('../error/bad-request-error');
const UnauthorizedError = require('../error/unauthorized-error');
const MongoError = require('../error/mongo-error');

// Создание нового профиля
module.exports.createNewProfile = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан емейл или пароль');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.send({ Message: 'Пользователь успешно создан' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные пользователя'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new MongoError('Такой пользователь уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

// Получение данных пользователя
module.exports.getMyProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Id пользователя введён неверно'));
      } else {
        next(err);
      }
    });
};

// Обновление профиля
module.exports.updateMyProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные пользователя'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new MongoError('Такой email уже есть в базе данных'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new UnauthorizedError('Неправильно введены email или пароль'));
      } else {
        next(err);
      }
    });
};
