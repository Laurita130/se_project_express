const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;

  ClothingItem.create({
    name,
    imageUrl,
    weather,
    owner: req.user._id,
  })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }

      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.send({ data: items });
    })
    .catch(next);
};

const updateItem = (req, res, next, method) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      [method]: { likes: userId },
    },
    {
      new: true,
    }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid Item ID"));
      }

      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError("Forbidden");
      }

      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid Item ID"));
      }

      return next(err);
    });
};

const likeClothingItem = (req, res, next) =>
  updateItem(req, res, next, "$addToSet");

const dislikeClothingItem = (req, res, next) =>
  updateItem(req, res, next, "$pull");

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  dislikeClothingItem,
};
