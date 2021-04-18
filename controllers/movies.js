const Movie = require('../models/movie');
const BadRequestError = require('../error/bad-request-error');
const NotFoundError = require('../error/not-found-error');
const ForbiddenError = require('../error/forbidden-error');

// Получение списка всех карточек
module.exports.getSavedMovies = (req, res) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movie) => res.status(200).send(movie))
    .catch((err) => res.status(500).send({ message: err }));
};

// Создание карточки
module.exports.createNewMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duretion,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;

  Movie.create({
    country,
    director,
    duretion,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Удаление карточки
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Такой карточки не существует'))
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        movie.remove();
        return res.status(200).send({ message: 'Карточка успешно удалена' });
      }
      throw new ForbiddenError('Вы не можете удалить карточку другого пользователя');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Id карточки указан неверно'));
      } else {
        next(err);
      }
    });
};
