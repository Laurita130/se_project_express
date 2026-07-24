const router = require("express").Router();

const {
  createItem,
  getItems,
  dislikeClothingItem,
  likeClothingItem,
  deleteItem,
} = require("../controllers/clothingItem");

const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateItemId,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(auth);

router.post("/", validateClothingItem, createItem);
router.put("/:itemId/likes", validateItemId, likeClothingItem);
router.delete("/:itemId/likes", validateItemId, dislikeClothingItem);
router.delete("/:itemId", validateItemId, deleteItem);

module.exports = router;