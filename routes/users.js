const router = require("express").Router();
const { getUsers, createUser } = require("../controllers/users");


router.get("/", getUsers);
router.get("/:userId", () => console.log("Get users by id"));
router.post("/", createUser);

module.exports = router;
