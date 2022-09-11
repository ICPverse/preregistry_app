const User = require('../models/auth.model');

exports.setWalletID = async (req, res) => {
  try {
    const { walletID } = req.body;
    if (!walletID) {
      throw 'WalletID is required';
    }

    await User.updateOne({ _id: req.user._id }, { $set: { walletID } });
    return res.json({ message: 'walletID set' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errors: err,
    });
  }
};
