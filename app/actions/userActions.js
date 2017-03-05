import Fetcher from '../utils/fetchClass';
import GraphQLClass from '../utils/graphqlClass';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';

export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';

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
