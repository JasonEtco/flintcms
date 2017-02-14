const mongoose = require('mongoose');

const Entry = mongoose.model('Entry');

module.exports = slug => slug ? Entry.findOne({ slug }) : Entry.find();
