const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  dislikeClothingItem,
  likeClothingItem,
  deleteItem,
} = require("../controllers/clothingItem");

router.get("/", getItems);

router.use(auth);

router.post("/", createItem);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", dislikeClothingItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
