import Fetcher from '../utils/fetchClass';

export const REQUEST_FIELDS = 'REQUEST_FIELDS';
export const RECEIVE_FIELDS = 'RECEIVE_FIELDS';
export const NEW_FIELD = 'NEW_FIELD';

export function newField(title, type) {
  return dispatch =>
    fetch('/admin/api/fields', {
      method: 'POST',
      body: JSON.stringify({ title, type }),
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(res => res.json())
      .then(json => dispatch({ type: NEW_FIELD, json }))
      .catch(err => new Error(err));
}

export function fetchFieldsIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'fields',
      request: REQUEST_FIELDS,
      receive: RECEIVE_FIELDS,
    };

    const fetcher = new Fetcher(fetcherOptions);
    return fetcher.beginFetch(dispatch, getState());
  };
}
