const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người mua hàng
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    enum: [
      "waiting", // chờ xác nhận
      "packed", // đã đóng gói
      "delivery", // đang giao hàng
      "received", // đã nhận hàng
      "cancel", // đã huỷ đơn
      "history", // lịch sử mua hàng
    ],
    default: "waiting",
  },
  totalAmount: { type: Number, required: true },
  isReviewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
