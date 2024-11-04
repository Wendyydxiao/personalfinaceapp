const mongoose = require('mongoose');

// Connect to the MongoDB URI from the environment variables or default to a local database
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/personalFinanceDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = mongoose.connection;
