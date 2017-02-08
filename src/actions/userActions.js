import h from '../utils/helpers';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';

function requestUser() {
  return {
    type: REQUEST_USER,
  };
}

function receiveUser(json) {
  return {
    type: RECEIVE_USER,
    user: json,
    receivedAt: Date.now(),
  };
}

function fetchUser() {
  return (dispatch) => {
    dispatch(requestUser());

    return fetch('admin/api/user', {
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(res => res.json())
      .then((json) => {
        h.receiveIfAuthed(json);
        dispatch(receiveUser(json));
      })
      .catch(err => new Error(err));
  };
}

function shouldFetchUser(state) {
  const { user } = state;
  if (!user.user) {
    return true;
  } else if (user.isFetching) {
    return false;
  }

  return user.didInvalidate;
}

export function fetchUserIfNeeded(user) {
  return (dispatch, getState) => {
    if (shouldFetchUser(getState())) {
      return dispatch(fetchUser(user));
    }

    return false;
  };
}
