const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // Liên kết đến đơn hàng
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  method: {
    type: String,
    enum: ["credit_card", "bank_transfer", "e_wallet", "cash_on_delivery"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  amount: { type: Number, required: true }, // $
  transactionId: { type: String }, // Mã giao dịch (cho các phương thức như thẻ tín dụng, ví điện tử)
  paymentDate: { type: Date, default: Date.now }, // Ngày thanh toán
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
