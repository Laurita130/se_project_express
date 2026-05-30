const router = require("express").Router();

const {createItem,getItems,dislikeClothingItem,likeClothingItem,deleteItem} = require("../controllers/clothingItem");

router.post("/", createItem);

router.get("/", getItems);

router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", dislikeClothingItem);

router.delete("/:itemId", deleteItem);

module.exports = router;