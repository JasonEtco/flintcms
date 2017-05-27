import { push } from 'react-router-redux';
import graphFetcher from '../utils/graphFetcher';
import store from '../utils/store';
import { RECEIVE_ENTRIES } from './entryActions';
import { RECEIVE_SECTIONS } from './sectionActions';
import { RECEIVE_FIELDS } from './fieldActions';
import { RECEIVE_USER, RECEIVE_USERS } from './userActions';
import { RECEIVE_USERGROUPS } from './usergroupActions';
import { RECEIVE_ASSETS } from './assetActions';
import { RECEIVE_SITE } from './siteActions';
import { RECEIVE_PLUGINS } from './pluginActions';

const permissionsQuery = `permissions {
  sections {
    canAddSections
    canDeleteSections
    canEditSections
  }
  fields {
    canAddFields
    canDeleteFields
    canEditFields
  }
  entries {
    canAddEntries
    canDeleteEntries
    canEditOthersEntries
    canEditLive
    canEditDrafts
    canSeeDrafts
    canChangeEntryStatus
  }
  assets {
    canAddAssets
    canEditAssets
    canDeleteAssets
  }
  users {
    canManageUsers
    canManageUserGroups
  }
  site {
    canManageSite
    canManagePlugins
    canCustomStyles
  }
}`;

const query = `{
  site {
    defaultUserGroup
    siteUrl
    siteName
    siteLogo
    style
    allowPublicRegistration
  }

  entries {
    _id
    title
    slug
    author {
      username
    }
    dateCreated
    section
    status
  }

  assets {
    _id
    title
    filename
    size
    width
    height
    dateCreated
  }

  fields {
    _id
    title
    instructions
    type
    dateCreated
    slug
    handle
    required
    options
  }

  sections {
    _id
    template
    title
    slug
    fields
    dateCreated
  }

  user {
    _id
    username
    email
    name {
      first
      last
    }
    dateCreated
    image
    usergroup {
      _id
      title
      slug
      ${permissionsQuery}
    }
  }

  users {
    _id
    username
    name {
      first
      last
    }
    dateCreated
    image
  }

  usergroups {
    _id
    title
    slug
    dateCreated
    ${permissionsQuery}
  }

  plugins {
    _id
    name
    icon {
      path
      buffer
    }
    dateInstalled
  }
}`;

export default async function bigFetch() {
  const { dispatch } = store;
  const { data, errors } = await graphFetcher(query);

  if (data.status === 401) {
    if (location.pathname === '/admin') {
      dispatch(push('/login'));
    } else {
      dispatch(push(`/login?p=${location.pathname}`));
    }
    return;
  }

  if (errors) throw new Error('Error!', errors);

  const { sections, assets, entries, fields, user, users, usergroups, site, plugins } = data.data;
  const dispatchers = [
    { type: RECEIVE_SECTIONS, sections },
    { type: RECEIVE_ASSETS, assets },
    { type: RECEIVE_ENTRIES, entries },
    { type: RECEIVE_FIELDS, fields },
    { type: RECEIVE_USER, user },
    { type: RECEIVE_USERS, users },
    { type: RECEIVE_USERGROUPS, usergroups },
    { type: RECEIVE_SITE, site },
    { type: RECEIVE_PLUGINS, plugins },
  ];

  const receivedAt = Date.now();
  dispatchers.forEach(obj => dispatch({ ...obj, receivedAt }));
}
