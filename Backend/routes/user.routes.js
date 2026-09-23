const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");


router.post(
  "/register",
  [
    body("fullName.firstName").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
    body("fullName.lastName").isLength({ min: 3 }).withMessage("Last name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  ],
  userController.registerUser
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")],
  userController.loginUser
);

router.get("/profile", authMiddleware.authenticateUser, userController.getUserProfile);

router.post("/refresh-token", userController.refreshToken);

router.post("/logout", authMiddleware.authenticateUser, userController.logoutUser);


module.exports = router;