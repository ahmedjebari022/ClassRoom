var express = require('express');
const userController = require('../controllers/userController');
var router = express.Router();
const { validateProfileUpdate, validateChangePassword } = require('../middlewares/userValidation');
const upload = require('../middlewares/upload');

router.get('/profile',userController.getProfile);
router.put('/change-password',  validateChangePassword,userController.changePassword);
router.put('/update-profile',upload.single('avatar') ,validateProfileUpdate,userController.updaterProfile);
router.put('/upload-avatar', upload.single('avatar'), userController.uploadAvatar);
module.exports = router;