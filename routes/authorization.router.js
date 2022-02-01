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
    check("email", "Введённый email некорректный").isEmail(),
    check("password", "Минимальная длина пароля 8 символов").isLength({
      min: 8,
    }),
    check("nickname", "Максимальная длина ника 10 символа").isLength({
      max: 10,
      min: 2,
    }),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при регистрации",
        });
      }

      const { email, password, nickname } = request.body;

      const newUserCandidateNickCheck = await User.findOne({ nickname });
      if (newUserCandidateNickCheck) {
        return response
          .status(400)
          .json({ message: "Данный Ник уже используется" });
      }

      const newUserCandidateEmailCeck = await User.findOne({ email });
      if (newUserCandidateEmailCeck) {
        return response
          .status(400)
          .json({ message: "Данный email уже используется" });
      }

      const cryptedPassword = await bcrypt.hash(password, 15);

      const user = new User({
        email: email,
        nickname: nickname,
        password: cryptedPassword,
      });

      await user.save();
      response
        .status(201)
        .json({ message: "Поздравляем, Вы зарегистрированы!" });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Возникла ошибка, попробуйте ещё раз" });
    }
  }
);

authorizationRouter.post(
  "/login",
  [
    check("email", "Введите корректный email").normalizeEmail().isEmail(),
    check("password", "Введите пароль").exists(),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при входе в систему",
        });
      }

      const { email, password, nickname } = request.body;

      const user = await User.findOne({ email });
      if (!user) {
        return response
          .status(400)
          .json({ message: "Пользователь с такими данными не найден" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return response
          .status(400)
          .json({ message: "Введённый пароль неверный" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "3h",
      });

      response.json({
        token,
        userId: user.id,
        nickname: user.nickname,
        message: "Вы успешно вошли в систему",
      });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Возникла ошибка, попробуйте ещё раз." });
    }
  }
);

module.exports = authorizationRouter;
