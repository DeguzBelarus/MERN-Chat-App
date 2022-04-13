const { Router } = require("express");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const authorizationRouter = Router();

authorizationRouter.post(
  "/registration",
  [
    check("email", "Введённый Вами email некорректный.").isEmail(),
    check("password", "Минимальная длина пароля - 8 символов.").isLength({
      min: 8,
    }),
    check("nickname", "Максимальная длина никнейма - 10 символов.").isLength({
      max: 10,
    }),
    check("nickname", "Минимальная длина никнейма - 2 символа.").isLength({
      min: 2,
    }),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при регистрации.",
        });
      }

      const { email, password, nickname } = request.body;

      const newUserCandidateNickCheck = await User.findOne({ nickname });
      if (newUserCandidateNickCheck) {
        return response
          .status(400)
          .json({ message: "Данный никнейм уже используется." });
      }

      const newUserCandidateEmailCeck = await User.findOne({ email });
      if (newUserCandidateEmailCeck) {
        return response
          .status(400)
          .json({ message: "Данный email уже используется." });
      }

      const cryptedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email: email,
        nickname: nickname,
        password: cryptedPassword,
      });

      await user.save();
      response.status(201).json({ message: "Вы успешно зарегистрированы!" });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Возникла ошибка, попробуйте ещё раз." });
    }
  }
);

authorizationRouter.post(
  "/login",
  [
    check("email", "Введите корректный email.").normalizeEmail().isEmail(),
    check("password", "Введите пароль.").exists(),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при входе в систему.",
        });
      }

      const { email, password, nickname } = request.body;

      const user = await User.findOne({ email });
      if (!user) {
        return response
          .status(400)
          .json({ message: "Неверные данные для входа в систему." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return response
          .status(400)
          .json({ message: "Неверные данные для входа в систему." });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "3h",
      });

      response.json({
        token,
        userId: user.id,
        nickname: user.nickname,
        message: "Вы успешно вошли в систему!",
      });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Возникла ошибка, попробуйте ещё раз." });
    }
  }
);

module.exports = authorizationRouter;
