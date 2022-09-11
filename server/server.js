const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

require('dotenv').config({
  path: './config/config.env',
});

// Connect to DB
connectDB();

app.use(express.json());

// cors to allow to deal with frontend locally
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  // morgan is used for logging
  app.use(morgan('dev'));
}

// Load Routes
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');

app.use('/api/', authRouter);
app.use('/api/', userRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page Not Found',
  });
});

const PORT = process.env.PORT || 5000;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));

// TODO

// 5.) Translate
