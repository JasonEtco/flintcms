import Fetcher from '../utils/fetchClass';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';

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
