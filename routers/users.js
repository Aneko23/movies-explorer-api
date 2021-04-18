const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMyProfile } = require('../controllers/users');
const { updateMyProfile } = require('../controllers/users');

router.get('/me', getMyProfile);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
  }),
}), updateMyProfile);

module.exports = router;
