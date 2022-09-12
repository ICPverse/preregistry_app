const mongoose = require('mongoose');
// user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    isArtist: Boolean,
    preferences: [String],

    walletID: String,
    fav: String,
  },
  {
    timestamps: true,
  }
);

// virtual

// methods

module.exports = mongoose.model('User', userSchema);
