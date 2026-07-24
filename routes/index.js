const router = require("express").Router();

const clothingItemRouter = require("./clothingItem");
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");

const {
  validateSignup,
  validateSignin,
} = require("../middlewares/validation");

router.post("/signup", validateSignup, createUser);
router.post("/signin", validateSignin, login);

router.use("/users", auth, userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: "Route not found",
  });
});

module.exports = router;