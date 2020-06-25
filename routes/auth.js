const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignin,
  forgotPassword,
  resetPassword,
  socialLogin
} = require("../controllers/auth");
const { userSignupValidator, passwordResetValidator } = require("../validator");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

router.post("/social-login", socialLogin);

module.exports = router;
