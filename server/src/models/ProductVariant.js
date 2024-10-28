const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
  variantName: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, required: true },
  image: { type: String, require: true },
  attributes: {
    color: { type: String }, // Ví dụ: Màu sắc
    size: { type: String }, // Ví dụ: "Lớn", "Nhỏ", "500ml"
    material: { type: String }, // Ví dụ: Chất liệu cho các sản phẩm như "nhựa", "thép",...
  },
});

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);

module.exports = { productVariantSchema, ProductVariant };
