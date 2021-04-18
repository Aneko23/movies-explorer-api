const mongoose = require('mongoose');

// Схема фильма
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /(https*:\/\/)(www\.)*(\w{1,}\W{1,}){1,}/gm.test(v);
      },
      message: 'URL введён неверно',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /(https*:\/\/)(www\.)*(\w{1,}\W{1,}){1,}/gm.test(v);
      },
      message: 'URL введён неверно',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /(https*:\/\/)(www\.)*(\w{1,}\W{1,}){1,}/gm.test(v);
      },
      message: 'URL введён неверно',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('card', movieSchema);
