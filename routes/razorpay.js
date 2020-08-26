const Razorpay = require("razorpay");
const express = require("express");
const { curry } = require("lodash");
const shortid = require("shortid");
const { requireSignin, isAuth } = require("../controllers/auth");
const router = express.Router();
const RazorpayModel = require("../models/razorpay");
require("dotenv").config();

const { userById } = require("../controllers/user");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

router.post(
  "/razorpay/createorder/:userId",
  requireSignin,
  isAuth,
  async (req, res) => {
    const payment_capture = 1;
    const amount = req.body.amount;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture
    };

    try {
      const response = await razorpay.orders.create(options);
      console.log(response);
      const payment = new RazorpayModel({
        order_id: response.id,
        amount: response.amount,
        user: req.params.userId
      });

      payment.save((err, pay) => {
        if (err) {
          console.log(err);
        }
        console.log(pay);
      });
      // console.log(payment);

      res.json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
        receipt: options.receipt
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/verification", (req, res) => {
  // do a validation
  const secret = process.env.RAZORPAY_WEBHOOK;

  console.log(req.body);

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    var myquery = { order_id: req.body.payload.payment.entity.order_id };
    var newvalues = {
      $set: {
        payment_id: req.body.payload.payment.entity.id,
        razorpay_signature: digest,
        completed: true
      }
    };
    RazorpayModel.updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log(res);
    });
  } else {
    console.log("Error");
  }
  res.json({ status: "ok" });
});

router.param("userId", userById);

module.exports = router;
