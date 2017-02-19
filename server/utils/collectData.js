const mongoose = require('mongoose');

const Entry = mongoose.model('Entry');
const Section = mongoose.model('Section');
const User = mongoose.model('User');

module.exports = async function collectData(data) {
  const entries = await Entry.find().lean();
  const sections = await Section.find().lean();
  const users = await User.find().lean();

  const bigData = await Object.assign({}, { entry: data }, { flint: {
    entries, sections, users,
  } });

  return bigData;
};
