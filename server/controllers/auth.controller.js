const expressJwt = require('express-jwt');
const _ = require('lodash');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/auth.model');
// Custom error handler to get useful error messages

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.registerController = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'All the fields are required',
    });
  }
  User.findOne({
    email,
  }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        errors: 'Email is taken',
      });
    }
    // const token = jwt.sign(
    //   {
    //     name,
    //     email,
    //     password,
    //   },
    //   process.env.JWT_ACCOUNT_ACTIVATION,
    //   {
    //     expiresIn: '5m',
    //   }
    // );
    // // Email data sending
    // const mailOptions = {
    //   from: process.env.EMAIL_FROM,
    //   to: email,
    //   subject: 'Subject Line',
    //   text: 'Hello world',
    //   html: `<h1>Please Click the Link to activate</h1>
    //   <p>${process.env.CLIENT_URI}/users/activate/${token}</p>`,
    // };
    // // send Email
    // transporter.sendMail(mailOptions, (error) => {
    //   if (error) {
    //     console.log('err', error);

    //     return res.status(400).json({ error: errorHandler(err) });
    //   }
    //   return res.json({ message: `Email has been send to ${email}` });
    // });
    const user1 = new User({
      email,
      password,
    });

    user1.save((error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log('Save error' + error);
        return res.status(401).json({
          errors: error,
        });
      }
      return res.json({ message: 'registerd' });
    });
  });
  return true;
};

// activate and save to database

exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('Activation error');
        return res.status(401).json({
          errors: 'Expired link. Signup again',
        });
      }
      const { userName, email, password } = jwt.decode(token);

      const user = new User({
        email,
        password,
      });

      user.save((error) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.log('Save error' + error, errorHandler(error));
          return res.status(401).json({
            errors: errorHandler(error),
          });
        }
        return true;
      });

      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: 'Email and password do not match',
        });
      }
      // generate a token and send to client
      const newToken = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        }
      );
      const { _id, role } = user;

      // activate no returns token and user for localhost

      return res.json({
        token: newToken,
        user: {
          _id,
          email,
          role,
        },
      });
    });
  } else {
    return res.json({
      message: 'error happening please try again',
    });
  }
  return true;
};

exports.loginController = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: 'All the fields are required',
    });
  }
  // check if user exist
  User.findOne({
    email,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        errors: 'User with that email does not exist. Please signup',
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        errors: 'Email and password do not match',
      });
    }
    // generate a token and send to client
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );
    // eslint-disable-next-line no-shadow
    const { _id, name, email } = user;

    return res.json({
      token,
      user: {
        _id,
        email,
      },
    });
  });
  return true;
};

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  }
  User.findOne(
    {
      email,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'User with that email does not exist',
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_RESET_PASSWORD,
        {
          expiresIn: '10m',
        }
      );

      // Email data sending
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset link',
        text: 'Hello world',
        html: `
                  <h1>Please use the following link to reset your password</h1>
                  <p>${process.env.CLIENT_URI}/users/password/reset/${token}</p>
              `,
      };

      return user.updateOne(
        {
          resetPasswordLink: token,
        },
        (error) => {
          if (error) {
            // eslint-disable-next-line no-console
            console.log('RESET PASSWORD LINK ERROR', error);
            return res.status(400).json({
              error:
                'Database connection error on user password forgot request',
            });
          }
          // send Email
          transporter.sendMail(mailOptions, (senderror) => {
            if (senderror) {
              return res.json({
                message: err.message,
              });
            }
            return res.json({
              message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
            });
          });
          return true;
        }
      );
    }
  );
  return true;
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  }
  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err) => {
      if (err) {
        return res.status(400).json({
          error: 'Expired link. Try again',
        });
      }

      User.findOne(
        {
          resetPasswordLink,
        },
        (error, user) => {
          if (error || !user) {
            return res.status(400).json({
              error: 'Something went wrong. Try later',
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: '',
          };

          // eslint-disable-next-line no-param-reassign
          user = _.extend(user, updatedFields);

          // eslint-disable-next-line no-shadow
          user.save((err) => {
            if (err) {
              return res.status(400).json({
                error: 'Error resetting user password',
              });
            }
            res.json({
              message: `Great! Now you can login with your new password`,
            });
            return true;
          });
          return true;
        }
      );

      return true;
    });
  }

  return true;
};

exports.changeEmailController = async (req, res) => {
  const { newEmail } = req.body;
  try {
    const user = await User.findById({ _id: req.user._id }).exec();
    const userEmail = await User.findOne({ email: newEmail }).exec();
    if (userEmail) {
      throw 'Email is taken';
    }
    const oldEmail = user.email;
    const name = user.name;
    const token = jwt.sign(
      { name, oldEmail, newEmail },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '5m',
      }
    );

    // Email data sending
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: newEmail,
      subject: 'Subject Line',
      text: 'Hello world',
      html: `<h1>Please Click the Link to change your email address</h1>
  <p>${process.env.CLIENT_URI}/users/change-email/${token}</p>`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log('err', error);

        throw error;
      }
      return res.json({ message: `Email has been send to ${newEmail}` });
    });
  } catch (err) {
    return res.status(400).json({
      errors: err,
    });
  }

  return true;
};

exports.verifyEmailChangeController = async (req, res) => {
  try {
    const { newToken } = req.body;
    if (newToken) {
      jwt.verify(newToken, process.env.JWT_ACCOUNT_ACTIVATION, async (err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log('Activation error');
          return res.status(401).json({
            errors: 'Expired link. Signup again',
          });
        }
        const { name, oldEmail, newEmail } = jwt.decode(newToken);

        const user = await User.findOne({ email: oldEmail }).exec();

        const newUser = await User.updateOne(
          { email: oldEmail },
          { $set: { email: newEmail } }
        ).exec();

        if (user.subscriptionID) {
          const subscription = await stripe.subscriptions.retrieve(
            user.subscriptionID
          );
          const customer = await stripe.customers.retrieve(
            subscription.customer
          );
          const updatedCustomer = await stripe.customers.update(customer.id, {
            email: newEmail,
          });
        }

        res.json({ user: newUser });
        return true;
      });
    } else {
      return res.json({
        message: 'error happening please try again',
      });
    }
    return true;
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errors: err,
    });
  }
};

exports.changePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw 'Please send all the fields';
    }
    let user = await User.findById({ _id: req.user._id }).exec();

    if (!user.authenticate(oldPassword)) {
      throw 'Incorrect password';
    }

    const updatedFields = {
      password: newPassword,
    };

    // eslint-disable-next-line no-param-reassign
    user = _.extend(user, updatedFields);

    user.save((err) => {
      if (err) {
        throw 'Error occured';
      }
      res.json({
        message: `Password changed!`,
      });
      return true;
    });
    return true;
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errors: err,
    });
  }
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET, // Adds req.user._id. Token is safer than localhost
  algorithms: ['HS256'],
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({
    _id: req.user._id,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'Admin resource. Access denied.',
      });
    }

    req.profile = user;
    next();
    return true;
  });
};
