const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
    image: Joi.string().required().uri(),
    trailer: Joi.string().uri().required(),
    thumbnail: Joi.string().uri().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().required().length(10),
  }),
}), createNewMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().alphanum().length(24),
  }),
}), deleteMovie);

module.exports = router;
