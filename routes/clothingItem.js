const router = require("express").Router();

const {
  createItem,
  getItems,
  dislikeClothingItem,
  likeClothingItem,
  deleteItem,
} = require("../controllers/clothingItem");

const auth = require("../middlewares/auth");

router.get("/", getItems);

router.use(auth);

router.post("/", createItem);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", dislikeClothingItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
