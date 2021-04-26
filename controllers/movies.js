const Movie = require('../models/movie');
const BadRequestError = require('../error/bad-request-error');
const NotFoundError = require('../error/not-found-error');
const ForbiddenError = require('../error/forbidden-error');

// Получение списка всех сохранённых фильмах
module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => next(err));
};

// Создание фильма
module.exports.createNewMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then(() => res.send({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .populate('owner')
    .orFail(new NotFoundError('Такой карточки не существует'))
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        movie.remove();
      } else {
        throw new ForbiddenError('Вы не можете удалить карточку другого пользователя');
      }
    })
    .then(() => {
      res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Id карточки указан неверно'));
      } else {
        next(err);
      }
    });
};
