import h from '../utils/helpers';

export const REQUEST_ENTRIES = 'REQUEST_ENTRIES';
export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const NEW_ENTRY = 'NEW_ENTRY';

export function newEntry(title, sectionId) {
  console.log(title, sectionId);
  return dispatch =>
    fetch('/admin/api/entries', {
      method: 'POST',
      body: JSON.stringify({ title, sectionId }),
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(res => res.json())
      .then(json => dispatch({ type: NEW_ENTRY, json }))
      .catch(err => new Error(err));
}

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
        h.receiveIfAuthed(json)
          .then(dispatch(receiveEntries(json)));
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
