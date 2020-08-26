const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const razorpaySchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      trim: true,
      required: true
    },
    payment_id: {
      type: String,
      trim: true,
      default: ""
    },
    razorpay_signature: {
      type: String,
      trim: true,
      default: ""
    },
    completed: {
      type: Boolean,
      default: false
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("RazorpayModel", razorpaySchema);
