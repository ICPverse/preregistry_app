const express = require('express');

const router = express.Router();

const { setWalletID } = require('../controllers/user.controller');
const { requireSignin } = require('../controllers/auth.controller');

router.patch('/setID', requireSignin, setWalletID);

module.exports = router;
