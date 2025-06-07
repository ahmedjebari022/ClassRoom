var express = require('express');
const userController = require('../controllers/userController');
var router = express.Router();
const { validateProfileUpdate, validateChangePassword } = require('../middlewares/userValidation');


router.get('/profile',userController.getProfile);
router.put('/change-password',  validateChangePassword,userController.changePassword);
router.put('/update-profile', validateProfileUpdate,userController.updaterProfile);

module.exports = router;