const mongoose = require('mongoose');

const Entry = mongoose.model('Entry');

module.exports = slug => Entry.findOne({ slug });
