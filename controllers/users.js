const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    console.error(err);
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: "An error has occurred on the server",
    });
  }
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

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

    return res.status(201).send(userObject);
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(CONFLICT).send({
        message: "A user with that email already exists",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({
        message: err.message,
      });
    }

    return res.status(INTERNAL_SERVER_ERROR).send({
      message: "Internal server error",
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({
      message: "Email and password are required",
    });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch(() =>
      res.status(UNAUTHORIZED).send({
        message: "Incorrect email or password",
      })
    );
};

const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).orFail();

    return res.status(200).send(user);
  } catch (err) {
    console.error(err);

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({
        message: "User not found",
      });
    }

    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({
        message: "Invalid user ID",
      });
    }

    return res.status(INTERNAL_SERVER_ERROR).send({
      message: "Internal server error",
    });
  }
};

const getCurrentUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).orFail();

    return res.status(200).send(user);
  } catch (err) {
    console.error(err);

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({
        message: "User not found",
      });
    }

    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({
        message: "Invalid user ID",
      });
    }

    return res.status(INTERNAL_SERVER_ERROR).send({
      message: "Internal server error",
    });
  }
};

const updateProfile = async (req, res) => {
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

    return res.status(200).send(user);
  } catch (err) {
    console.error(err);

    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({
        message: "User not found",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({
        message: err.message,
      });
    }

    return res.status(INTERNAL_SERVER_ERROR).send({
      message: "Internal server error",
    });
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
