import { push } from 'react-router-redux';
import graphFetcher from '../utils/graphFetcher';
import GraphQLClass from '../utils/graphqlClass';
import { errorToasts } from './uiActions';

export const REQUEST_USERGROUP = 'REQUEST_USERGROUP';
export const RECEIVE_USERGROUP = 'RECEIVE_USERGROUP';
export const NEW_USERGROUP = 'NEW_USERGROUP';

export const REQUEST_USERGROUPS = 'REQUEST_USERGROUPS';
export const RECEIVE_USERGROUPS = 'RECEIVE_USERGROUPS';

export function newUserGroup(data) {
  return (dispatch) => {
    const query = `mutation ($data: UserGroupInput!) {
      addUserGroup(data: $data) {
        _id
      }
    }`;

    const variables = {
      data,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { addUserGroup } = json.data.data;
        dispatch({ type: NEW_USERGROUP, addUserGroup });
        dispatch(push('/admin/users'));
      })
      .catch(errorToasts);
  };
}

export function fetchUserGroupsIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'usergroups',
      request: REQUEST_USERGROUPS,
      receive: RECEIVE_USERGROUPS,
    };

    const query = `{
      usergroups {
        _id
        title
        slug
        dateCreated
        permissions {
          canAddSections
          canDeleteSections
          canEditSections
          canAddFields
          canDeleteFields
          canEditFields
          canAddEntries
          canDeleteEntries
          canOnlyEditOwnEntries
          canEditLive
          canEditDrafts
          canSeeDrafts
          canChangeEntryStatus
          canManageUsers
          canManageUserGroups
        }
      }
    }`;

    const fetcher = new GraphQLClass(fetcherOptions, query);
    return fetcher.beginFetch(dispatch, getState());
  };
}
