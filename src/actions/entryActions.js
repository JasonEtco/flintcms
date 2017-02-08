import h from '../utils/helpers';

export const REQUEST_ENTRIES = 'REQUEST_ENTRIES';
export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';

function requestEntries() {
  return {
    type: REQUEST_ENTRIES,
  };
}

function receiveEntries(json) {
  return {
    type: RECEIVE_ENTRIES,
    entries: json,
    receivedAt: Date.now(),
  };
}

function fetchEntries() {
  return (dispatch) => {
    dispatch(requestEntries());

    return fetch('/admin/api/entries', {
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then((json) => {
        h.receiveIfAuthed(json);
        dispatch(receiveEntries(json));
      })
      .catch(err => new Error(err));
  };
}

function shouldFetchEntries(state) {
  const { entries } = state;
  if (!entries.entries) {
    return true;
  } else if (entries.isFetching) {
    return false;
  }

  return entries.didInvalidate;
}

export function fetchEntriesIfNeeded(entries) {
  return (dispatch, getState) => {
    if (shouldFetchEntries(getState())) {
      return dispatch(fetchEntries(entries));
    }

    return false;
  };
}
