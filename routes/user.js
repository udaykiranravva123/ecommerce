const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const {
  userById,
  read,
  update,
  purchaseHistory
} = require("../controllers/user");

const { createaddresss, getAddress } = require("../controllers/auth");

router.post("/user/address/:userId", requireSignin, isAuth, createaddresss);
router.get("/user/getaddress", getAddress);

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);

router.param("userId", userById);

module.exports = router;
