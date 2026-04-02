const express = require("express");
const router = express.Router();
const controllerloginSignup = require("../controller/loginSignCon");

router.post("/login",controllerloginSignup.loginuser);
router.post("/signup",controllerloginSignup.signupcheck)

module.exports = router