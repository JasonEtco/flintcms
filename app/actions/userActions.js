import { push } from 'react-router-redux';
import Fetcher from '../utils/fetchClass';
import graphFetcher from '../utils/graphFetcher';
import GraphQLClass from '../utils/graphqlClass';
import h from '../utils/helpers';
import { errorToasts } from './uiActions';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const NEW_USER = 'NEW_USER';

export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';

export function newUser(user) {
  return (dispatch, getState) => {
    const query = {
      query: `mutation ($user: UserInput!) {
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
      }`,
      variables: {
        user,
      },
    };

    return graphFetcher(query)
      .then((json) => {
        const { users } = getState();
        const { addUser } = json.data.data;

        // Only add the new entry to store if it doesn't already exist
        // In case socket event happens first
        if (!h.checkFor(users.users, '_id', addUser._id)) {
          dispatch({ type: NEW_USER, addUser });
        }

        dispatch(push('/admin/users'));
      })
      .catch((error) => {
        if (error.response) dispatch(errorToasts(error.response.data.errors));
      });
  };
}

export function fetchUserIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'user',
      request: REQUEST_USER,
      receive: RECEIVE_USER,
    };

    const fetcher = new Fetcher(fetcherOptions);
    return fetcher.beginFetch(dispatch, getState());
  };
}

export function fetchUsersIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'users',
      request: REQUEST_USERS,
      receive: RECEIVE_USERS,
    };

    const query = {
      query: `{
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
      }`,
    };

    const fetcher = new GraphQLClass(fetcherOptions, query);
    return fetcher.beginFetch(dispatch, getState());
  };
}
