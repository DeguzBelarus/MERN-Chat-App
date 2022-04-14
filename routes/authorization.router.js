const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authorizationRouter = Router();

authorizationRouter.post(
  "/registration",
  [
    check("email", "The email you entered is incorrect.").isEmail(),
    check("password", "The minimum password length is 8 characters.").isLength({
      min: 8,
    }),
    check("nickname", "The maximum nickname length is 10 characters.").isLength(
      {
        max: 10,
      }
    ),
    check("nickname", "The minimum nickname length is 2 characters.").isLength({
      min: 2,
    }),
  ],
  async (request, response) => {
    try {
      const { email, password, nickname, currentLanguage } = request.body;

      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message:
            currentLanguage === "ru"
              ? "Некорректные данные при регистрации."
              : "Incorrect data during registration.",
        });
      }

      const newUserCandidateNickCheck = await User.findOne({ nickname });
      if (newUserCandidateNickCheck) {
        return response.status(400).json({
          message:
            currentLanguage === "ru"
              ? "Данный никнейм уже используется."
              : "This nickname is already in use.",
        });
      }

      const newUserCandidateEmailCeck = await User.findOne({ email });
      if (newUserCandidateEmailCeck) {
        return response.status(400).json({
          message:
            currentLanguage === "ru"
              ? "Данный email уже используется."
              : "This email is already in use.",
        });
      }

      const cryptedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email: email,
        nickname: nickname,
        password: cryptedPassword,
      });

      await user.save();
      response.status(201).json({
        message:
          currentLanguage === "ru"
            ? "Вы успешно зарегистрированы!"
            : "You have successfully registered!",
      });
    } catch (error) {
      response.status(500).json({
        message:
          currentLanguage === "ru"
            ? "Возникла ошибка, попробуйте ещё раз."
            : "An error has occurred, please try again.",
      });
    }
  }
);

authorizationRouter.post(
  "/login",
  [
    check("email", "Enter the correct email.").normalizeEmail().isEmail(),
    check("password", "Enter the password.").exists(),
  ],
  async (request, response) => {
    try {
      const { email, password, currentLanguage } = request.body;

      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message:
            currentLanguage === "ru"
              ? "Некорректные данные при входе в систему."
              : "Incorrect data when logging in.",
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return response.status(400).json({
          message:
            currentLanguage === "ru"
              ? "Неверные данные для входа в систему."
              : "Invalid login information.",
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return response.status(400).json({
          message:
            currentLanguage === "ru"
              ? "Неверные данные для входа в систему."
              : "Invalid login information.",
        });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "2h",
      });

      response.json({
        token,
        userId: user.id,
        nickname: user.nickname,
        message:
          currentLanguage === "ru"
            ? "Вы успешно вошли в систему!"
            : "You have successfully logged in!",
      });
    } catch (error) {
      response.status(500).json({
        message:
          currentLanguage === "ru"
            ? "Возникла ошибка, попробуйте ещё раз."
            : "An error has occurred, please try again.",
      });
    }
  }
);

module.exports = authorizationRouter;
