const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  belongToShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    default: null,
  },
});
const Category = mongoose.model('Category', categorySchema)

module.exports = Category
