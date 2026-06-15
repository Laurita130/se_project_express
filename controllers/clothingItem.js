const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;

  ClothingItem.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Server error" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" });
      console.error(e);
    });
};

const updateItem = (req, res, method) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { [method]: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.send({ data: item }))
    .catch((e) => {
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid Item ID" });
      }
      if (e.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from  updateItem" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res.status(FORBIDDEN).send({
          message: "Forbidden",
        });
      }
      return res.status(200).send({ item });
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .catch((e) => {
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid Request" });
      }
      if (e.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from  deleteItem", e });
    });
};
const likeClothingItem = (req, res) => updateItem(req, res, "$addToSet");
const dislikeClothingItem = (req, res) => updateItem(req, res, "$pull");

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  dislikeClothingItem,
};
