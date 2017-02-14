import Fetcher from '../utils/fetchClass';

export const REQUEST_SECTIONS = 'REQUEST_SECTIONS';
export const RECEIVE_SECTIONS = 'RECEIVE_SECTIONS';

export function newSection(title) {
  fetch('/admin/api/sections', {
    method: 'POST',
    body: JSON.stringify({ title }),
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then(res => res.json())
    .then(json => console.log(json));
}

export function fetchSectionsIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'sections',
      request: REQUEST_SECTIONS,
      receive: RECEIVE_SECTIONS,
    };

    const fetcher = new Fetcher(fetcherOptions);
    return fetcher.beginFetch(dispatch, getState());
  };
}
