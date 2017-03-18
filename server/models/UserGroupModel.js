const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Schema = mongoose.Schema;

const UserGroupSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: {
    // Sections
    canAddSections: {
      type: Boolean,
      default: false,
    },
    canDeleteSections: {
      type: Boolean,
      default: false,
    },
    canEditSections: {
      type: Boolean,
      default: false,
    },

    // Fields
    canAddFields: {
      type: Boolean,
      default: false,
    },
    canDeleteFields: {
      type: Boolean,
      default: false,
    },
    canEditFields: {
      type: Boolean,
      default: false,
    },

    // Entries
    canAddEntries: {
      type: Boolean,
      default: false,
    },
    canDeleteEntries: {
      type: Boolean,
      default: false,
    },
    canOnlyEditOwnEntries: {
      type: Boolean,
      default: false,
    },
    canEditLive: {
      type: Boolean,
      default: false,
    },
    canSeeDrafts: {
      type: Boolean,
      default: false,
    },
    canEditDrafts: {
      type: Boolean,
      default: false,
    },
    canChangeEntryStatus: {
      type: Boolean,
      default: false,
    },

    // Users
    canManageUsers: {
      type: Boolean,
      default: false,
    },
    canManageUserGroups: {
      type: Boolean,
      default: false,
    },
  },
});

// Can't use arrow function because of (this) binding
// eslint-disable-next-line func-names
UserGroupSchema.pre('validate', function (next) {
  this.slug = h.slugify(this.title);
  next();
});

module.exports = mongoose.model('UserGroup', UserGroupSchema, 'user_groups');
