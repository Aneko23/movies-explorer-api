const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMyProfile } = require('../controllers/users');
const { updateMyProfile } = require('../controllers/users');

router.get('/me', getMyProfile);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateMyProfile);

module.exports = router;
