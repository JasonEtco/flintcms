import { push } from 'react-router-redux';
import graphFetcher from '../utils/graphFetcher';
import store from '../utils/store';
import { RECEIVE_ENTRIES } from './entryActions';
import { RECEIVE_SECTIONS } from './sectionActions';
import { RECEIVE_FIELDS } from './fieldActions';
import { RECEIVE_USER, RECEIVE_USERS } from './userActions';
import { RECEIVE_USERGROUPS } from './usergroupActions';
import { RECEIVE_ASSETS } from './assetActions';

const query = `{
  entries {
    _id
    title
    slug
    author
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
    name {
      first
      last
    }
    dateCreated
    image
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
    permissions {
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
        canOnlyEditOwnEntries
        canEditLive
        canEditDrafts
        canSeeDrafts
        canChangeEntryStatus
      }
      users {
        canManageUsers
        canManageUserGroups
      }
    }
  }
}`;

export default async function bigFetch() {
  const { dispatch } = store;
  const { data, errors } = await graphFetcher(query);

  if (data.status === 401) dispatch(push(data.redirect));
  if (errors) throw new Error('Error!', errors);

  const { sections, assets, entries, fields, user, users, usergroups } = data.data;
  const dispatchers = [
    { type: RECEIVE_SECTIONS, sections },
    { type: RECEIVE_ASSETS, assets },
    { type: RECEIVE_ENTRIES, entries },
    { type: RECEIVE_FIELDS, fields },
    { type: RECEIVE_USER, user },
    { type: RECEIVE_USERS, users },
    { type: RECEIVE_USERGROUPS, usergroups },
  ];

  const receivedAt = Date.now();
  dispatchers.forEach(obj => dispatch({ ...obj, receivedAt }));
}
