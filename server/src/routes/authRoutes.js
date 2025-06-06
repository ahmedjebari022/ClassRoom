var express = require('express');

var router = express.Router();
var authController = require('../controllers/authController');

router.post("/login",authController.login);
// router.post("/api/auth/logout", authController.logout);
router.post("/register", authController.register);

router.post("/logout", authController.logout); 
router.get("/me", authController.getMe); 

module.exports = router;