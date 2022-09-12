const express = require('express');

const router = express.Router();

const { setWalletID, setDetails } = require('../controllers/user.controller');
const { requireSignin } = require('../controllers/auth.controller');

router.patch('/setID', requireSignin, setWalletID);
router.put('/setdetails', requireSignin, setDetails);

module.exports = router;
