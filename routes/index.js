const router = require("express").Router();

const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const authRouter = require("./auth");
const auth = require("../middlewares/auth");

const { NOT_FOUND } = require("../utils/errors");

router.use("/", authRouter);

router.use("/items", clothingItem);

router.use("/users", auth, userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
