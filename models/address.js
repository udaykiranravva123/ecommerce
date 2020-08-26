const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    flatno: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    phonenumber: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Address", addressSchema);
