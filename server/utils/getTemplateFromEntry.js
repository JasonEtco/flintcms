const mongoose = require('mongoose');

const Section = mongoose.model('Section');

module.exports = ({ section }) => Section.findById(section);
