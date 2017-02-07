/* eslint no-console: 0 */

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_HOST, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});

mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));

// Close the Mongoose connected on Ctrl+C
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected');
    process.exit(0);
  });
});

require('../models/UserModel');
require('../models/EntryModel');
