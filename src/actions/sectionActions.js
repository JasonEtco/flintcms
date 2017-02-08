import h from '../utils/helpers';

export const REQUEST_SECTIONS = 'REQUEST_SECTIONS';
export const RECEIVE_SECTIONS = 'RECEIVE_SECTIONS';

export function addNewSection(title) {
  fetch('/admin/api/section', {
    method: 'POST',
    body: JSON.stringify({ title }),
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then(res => res.json())
    .then(json => console.log(json));
}

function requestSections() {
  return {
    type: REQUEST_SECTIONS,
  };
}

function receiveSections(json) {
  return {
    type: RECEIVE_SECTIONS,
    sections: json,
    receivedAt: Date.now(),
  };
}

function fetchSections() {
  return (dispatch) => {
    dispatch(requestSections());

    return fetch('/admin/api/sections', {
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then((json) => {
        h.receiveIfAuthed(json)
          .then(dispatch(receiveSections(json)));
      })
      .catch(err => new Error(err));
  };
}

function shouldFetchSections(state) {
  const { sections } = state;
  if (!sections.sections) {
    return true;
  } else if (sections.isFetching) {
    return false;
  }

  return sections.didInvalidate;
}

export function fetchSectionsIfNeeded(sections) {
  return (dispatch, getState) => {
    if (shouldFetchSections(getState())) {
      return dispatch(fetchSections(sections));
    }

    return false;
  };
}
