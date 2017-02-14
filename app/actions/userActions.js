import Fetcher from '../utils/fetchClass';

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

    const fetcher = new Fetcher(fetcherOptions);
    return fetcher.beginFetch(dispatch, getState());
  };
}
