const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getSavedMovies } = require('../controllers/movies');
const { createNewMovie } = require('../controllers/movies');
const { deleteMovie } = require('../controllers/movies');

router.get('/', getSavedMovies);
router.post('/', createNewMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().alphanum().length(24),
  }),
}), deleteMovie);

module.exports = router;
