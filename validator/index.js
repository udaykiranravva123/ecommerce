exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Name is Required").notEmpty();
  req
    .check("email", "Email Must be valid")
    .matches(/.+\@.+\..+/)
    .withMessage("Email Must Be Valid");
  req.check("password", "Password is Required").notEmpty();
  req
    .check("password")
    .isLength({
      min: 6
    })
    .withMessage("Password Must Contain atleast 6 Characters")
    .matches(/\d/)
    .withMessage("Password Must contain a Number");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      error: firstError
    });
  }
  next();
};

exports.passwordResetValidator = (req, res, next) => {
  // check for password
  req.check("newPassword", "Password is required").notEmpty();
  req
    .check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long");

  // check for errors
  const errors = req.validationErrors();
  // if error show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware or ...
  next();
};
