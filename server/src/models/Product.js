const mongoose = require("mongoose");
const ProductVariant = require("./ProductVariant");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    averageRating: { type: Number, default: 0 },
    location: { type: String, required: true },
    variants: [ProductVariant],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
