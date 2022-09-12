const mongoose = require('mongoose');
const crypto = require('crypto');
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
      required: true,
    },
    isArtist: Boolean,
    preferences: [String],
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: 'subscriber',
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
    walletID: String,
  },
  {
    timestamps: true,
  }
);

// virtual
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(() => this._password);

// methods
userSchema.methods = {
  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  makeSalt() {
    // eslint-disable-next-line prefer-template
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
};

module.exports = mongoose.model('User', userSchema);
