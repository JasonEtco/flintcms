import { push } from 'react-router-redux';
import graphFetcher from '../utils/graphFetcher';
import { errorToasts } from './uiActions';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const NEW_USER = 'NEW_USER';

export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';

/**
 * Adds a new user to the database
 * @param {Object} user
 */
export function newUser(user) {
  return (dispatch) => {
    const query = `mutation ($user: UserInput!) {
      addUser(user: $user) {
        _id
        username
        email
        name {
          first
          last
        }
        dateCreated
        image
      }
    }`;

    const variables = {
      user,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { addUser } = json.data.data;
        dispatch({ type: NEW_USER, addUser });
        dispatch(push('/admin/users'));
      })
      .catch(errorToasts);
  };
}
