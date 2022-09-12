const mongoose = require('mongoose');

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    createIndexes: true,
  });

  // eslint-disable-next-line no-console
  console.log(`MongoDB Connected: ${connection.connection.host}`);
};

module.exports = connectDB;
