const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const { JWT_SECRET } = require("../utils/config");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hash,
    });

    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).send(userObject);
  } catch (err) {
    if (err.code === 11000) {
      return next(
        new ConflictError("A user with that email already exists")
      );
    }

    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }

    return next(err);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.send({ token });
    })
    .catch(() =>
      next(
        new UnauthorizedError("Incorrect email or password")
      )
    );
};

const getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).orFail();

    res.send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }

    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid user ID"));
    }

    return next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();

    res.send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }

    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid user ID"));
    }

    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      {
        new: true,
        runValidators: true,
      }
    ).orFail();

    res.send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }

    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }

    return next(err);
  }
};

module.exports = {
  getUsers,
  createUser,
  login,
  getUser,
  getCurrentUser,
  updateProfile,
};