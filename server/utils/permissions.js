const perms = {
  sections: [
    { name: 'canAddSections', defaultValue: false, label: 'Can Add Sections' },
    { name: 'canDeleteSections', defaultValue: false, label: 'Can Delete Sections' },
    { name: 'canEditSections', defaultValue: false, label: 'Can Edit Sections' },
  ],

  fields: [
    { name: 'canAddFields', defaultValue: false, label: 'Can Add Fields' },
    { name: 'canDeleteFields', defaultValue: false, label: 'Can Delete Fields' },
    { name: 'canEditFields', defaultValue: false, label: 'Can Edit Fields' },
  ],

  entries: [
    { name: 'canAddEntries', defaultValue: false, label: 'Can Add Entries' },
    { name: 'canDeleteEntries', defaultValue: false, label: 'Can Delete Entries' },
    { name: 'canOnlyEditOwnEntries', defaultValue: false, label: 'Can Only Edit Own Entries' },
    { name: 'canEditLive', defaultValue: false, label: 'Can Edit Live' },
    { name: 'canSeeDrafts', defaultValue: false, label: 'Can See Drafts' },
    { name: 'canEditDrafts', defaultValue: false, label: 'Can Edit Drafts' },
    { name: 'canChangeEntryStatus', defaultValue: false, label: 'Can Change Entry Status' },
  ],

  users: [
    { name: 'canManageUsers', defaultValue: false, label: 'Can Manage Users' },
    { name: 'canManageUserGroups', defaultValue: false, label: 'Can Manage User Groups' },
  ],
};

exports.perms = perms;

/**
 * Reduces the permissions object to one that is easier to format
 * @param {Function} reducer - Reducer to format the returned objects
 * @returns {Object}
 */
function reducePermissionsToObject(reducer) {
  return Object.keys(perms).reduce((prev, curr) =>
  Object.assign({}, prev, { [curr]: perms[curr].reduce(reducer, {}) }), {});
}
exports.reducePermissionsToObject = reducePermissionsToObject;
