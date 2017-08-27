const mongoose = require('mongoose');
const mocks = require('./__mocks__');

function processArray(array) {
  return array.reduce(p => p, Promise.resolve());
}

module.exports = async () => {
  const User = mongoose.model('User');
  const Entry = mongoose.model('Entry');
  const Section = mongoose.model('Section');
  const UserGroup = mongoose.model('UserGroup');
  const Field = mongoose.model('Field');

  const deleteSections = async () => {
    const done = await Section.remove();
    return done;
  };

  const deleteUsers = async () => {
    const done = await User.remove();
    return done;
  };

  const deleteEntries = async () => {
    const done = await Entry.remove();
    return done;
  };

  const deleteUserGroups = async () => {
    const done = await UserGroup.remove();
    return done;
  };

  const deleteFields = async () => {
    const done = await Field.remove();
    return done;
  };


  const addUsers = async () => {
    const done = await User.create(mocks.users);
    return done;
  };

  const addFields = async () => {
    const done = await Field.create(mocks.fields);
    return done;
  };

  const addEntries = async () => {
    const done = await Entry.create(mocks.entries);
    return done;
  };

  const addSections = async () => {
    const done = await Section.create(mocks.sections);
    return done;
  };

  const addUserGroups = async () => {
    const done = await UserGroup.create(mocks.usergroups);
    return done;
  };

  return processArray([
    Promise.all([
      await deleteUsers(),
      await deleteUserGroups(),
      await deleteSections(),
      await deleteEntries(),
      await deleteFields(),
    ]),
    await addFields(),
    await addUserGroups(),
    await addUsers(),
    await addSections(),
    await addEntries(),
  ]);
};
