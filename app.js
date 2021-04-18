require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParcer = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routers/users');
const moviesRouter = require('./routers/movies');
const { createNewProfile, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./error/not-found-error');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cors());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .catch((error) => console.log(error));

app.use(bodyParcer.json());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
}), createNewProfile);

app.use('/users', auth, usersRouter);

app.use('/movies', auth, moviesRouter);

// Если ввели несуществующий адрес
app.use((req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

// Обработчик ошибок валидации
app.use(errors());

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: `${err.message}` } || 'Ошибка на сервере');
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер работает на порте ${PORT}`);
});
