var express = require('express');

var router = express.Router();
var authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/userValidation');


router.post("/login",validateLogin,authController.login);

router.post("/register", validateRegistration,authController.register);

router.post("/logout", authController.logout); 
router.get("/me", authController.getMe); 

module.exports = router;