const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getSavedMovies } = require('../controllers/movies');
const { createNewMovie } = require('../controllers/movies');
const { deleteMovie } = require('../controllers/movies');

router.get('/', getSavedMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value) => {
      if (validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true })) {
        return value;
      }
      throw new Error('Неверно указана ссылка на image');
    }),
    trailer: Joi.string().required().custom((value) => {
      if (validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true })) {
        return value;
      }
      throw new Error('Неверно указана ссылка на trailer');
    }),
    thumbnail: Joi.string().required().custom((value) => {
      if (validator.isURL(value, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true })) {
        return value;
      }
      throw new Error('Неверно указана ссылка на thumbnail');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required().integer(),
  }),
}), createNewMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().alphanum().length(24),
  }),
}), deleteMovie);

module.exports = router;
