const express = require("express");
const router = express.Router();

//Imporing the authvalidation functions for login and register 
const {  regsiterValidation, loginValidation} = require("../middleware/authvalidation")
//Importing functions from auth controller
const { login, register, validateToken } = require("../controller/auth")

const verifyToken = require("../middleware/auth");

//Register route with register validation 
router.post("/register", regsiterValidation, register);
//Login route with register validation
router.post("/login", loginValidation, login);

router.get("/validate", verifyToken , validateToken);


module.exports = router;