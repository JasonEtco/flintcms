import React from 'react';
import { push } from 'react-router-redux';
import graphFetcher from '../utils/graphFetcher';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_USERGROUP = 'REQUEST_USERGROUP';
export const RECEIVE_USERGROUP = 'RECEIVE_USERGROUP';
export const NEW_USERGROUP = 'NEW_USERGROUP';
export const DELETE_USERGROUP = 'DELETE_USERGROUP';
export const UPDATE_USERGROUP = 'UPDATE_USERGROUP';

export const REQUEST_USERGROUPS = 'REQUEST_USERGROUPS';
export const RECEIVE_USERGROUPS = 'RECEIVE_USERGROUPS';

const contents = `
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
  }`;

/**
 * Adds a new User Group to the database.
 * @param {Object} data - User Group Object
 */
export function newUserGroup(data) {
  return (dispatch) => {
    const query = `mutation ($data: UserGroupInput!) {
      addUserGroup(data: $data) {
        ${contents}
      }
    }`;

    const variables = {
      data,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { addUserGroup } = json.data.data;
        dispatch({ type: NEW_USERGROUP, addUserGroup });
        dispatch(push('/admin/settings/usergroups'));
      })
      .catch(errorToasts);
  };
}

/**
 * Deletes a User Group.
 * @param {String} _id
 */
export function deleteUserGroup(_id) {
  return (dispatch) => {
    const query = `mutation ($_id:ID!) {
      removeUserGroup(_id: $_id) {
        _id
        title
      }
    }`;

    const variables = {
      _id,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { removeUserGroup } = json.data.data;
        dispatch({ type: DELETE_USERGROUP, id: removeUserGroup._id });
        dispatch(push('/admin/settings/usergroups'));
        dispatch(newToast({
          message: <span><b>{removeUserGroup.title}</b> has been deleted.</span>,
          style: 'success',
        }));
      })
      .catch(errorToasts);
  };
}

/**
 * Updates a User Group
 * @param {String} _id - Mongo ID of the User Group
 * @param {Object} data - User Group Object
 */
export function updateUserGroup(_id, data) {
  return async (dispatch) => {
    const query = `mutation ($_id: ID!, $data: UserGroupInput!) {
      updateUserGroup(_id: $_id, data: $data) {
        ${contents}
      }
    }`;

    const variables = {
      _id,
      data,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const updatedUserGroup = json.data.data.updateUserGroup;
        dispatch({ type: UPDATE_USERGROUP, updateUserGroup: updatedUserGroup });
        dispatch(push('/admin/settings/usergroups'));
        dispatch(newToast({
          message: <span><b>{updatedUserGroup.title}</b> has been updated!</span>,
          style: 'success',
        }));
      })
      .catch(errorToasts);
  };
}
