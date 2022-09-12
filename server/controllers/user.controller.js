const User = require('../models/auth.model');

exports.setWalletID = async (req, res) => {
  try {
    const { walletID, email } = req.body;
    if (!walletID || !email) {
      throw 'All fields are required';
    }

    let oldUser = await User.findOne({ walletID });
    if (oldUser) {
      return res
        .status(400)
        .json({ message: 'Wallet is associated to a different email address' });
    }

    await User.updateOne({ email }, { $set: { walletID } });
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
    const { fav, userName, email } = req.body;
    if (!email) {
      throw 'Email is required';
    }

    const user = new User({ fav, userName, email });
    await user.save();

    return res.json({ message: 'details set' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errors: err,
    });
  }
};
