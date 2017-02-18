const mongoose = require('mongoose');

const Entry = mongoose.model('Entry');

module.exports = (slug) => {
  if (slug) return Entry.findOne({ slug });
  return Entry.find();
};
