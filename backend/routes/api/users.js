const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    handleValidationErrors
  ];

router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const emailChecking = await User.findOne({
        where: { email: email}
      });

      if (emailChecking) {
        res.status(403);
        return res.json({
            "message": "User already exists",
            "statusCode": 403,
            errors: [
              "User with that email already exists"
            ]
          })
      }

      const userNameChecking = await User.findOne({
        where: { username: username}
      })

      if (userNameChecking) {
        res.status(403);
        return res.json({
          "message": "User already exists",
          "statusCode": 403,
          errors: [
            "User with that username already exists"
          ]
        })
      }

      const user = await User.signup({ email, username, password, firstName, lastName });

      let token = await setTokenCookie(res, user);
      user.token = token;

      return res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        token: user.token,
      });
    }
  );

module.exports = router;
