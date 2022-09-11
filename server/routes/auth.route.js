const express = require('express');

const router = express.Router();

const {
  registerController,
  activationController,
  loginController,
  forgotPasswordController,
  requireSignin,
  resetPasswordController,
  changeEmailController,
  verifyEmailChangeController,
  changePasswordController,
} = require('../controllers/auth.controller');

router.post('/register', registerController);
router.post('/login', loginController);
// router.post('/activation', activationController);
// router.put('/update-email', requireSignin, changeEmailController);
// router.put('/activate-email', verifyEmailChangeController);
// router.put('/change-password', requireSignin, changePasswordController);

// router.put(
//   '/password/forgot',

//   forgotPasswordController
// );

// router.put('/resetpassword', resetPasswordController);

module.exports = router;
