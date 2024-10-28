const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    like: {
        type: Number,
        default: 0
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
