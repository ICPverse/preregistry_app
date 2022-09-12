const User = require('../models/auth.model');

exports.setWalletID = async (req, res) => {
  try {
    const { walletID } = req.body;
    if (!walletID) {
      throw 'WalletID is required';
    }

    let oldUser = await User.findOne({ walletID });
    if (oldUser) {
      return res
        .status(400)
        .json({ message: 'Wallet is associated to a different email address' });
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

exports.setDetails = async (req, res) => {
  try {
    const { preferences, isArtist } = req.body;

    await User.updateOne(
      { _id: req.user._id },
      { $set: { preferences, isArtist } }
    );
    return res.json({ message: 'details set' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errors: err,
    });
  }
};
