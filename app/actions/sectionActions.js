import { push } from 'react-router-redux';
import GraphQLClass from '../utils/graphqlClass';

export const REQUEST_SECTIONS = 'REQUEST_SECTIONS';
export const RECEIVE_SECTIONS = 'RECEIVE_SECTIONS';
export const NEW_SECTION = 'NEW_SECTION';
export const DELETE_SECTION = 'DELETE_SECTION';

export function newSection(title, template, fields) {
  return dispatch =>
  fetch('/admin/api/sections', {
    method: 'POST',
    body: JSON.stringify({ title, template, fields }),
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then(res => res.json())
    .then((json) => {
      dispatch({ type: NEW_SECTION, newSection: json });
      dispatch(push(`/admin/entries/${json.slug}`));
    })
    .catch(err => new Error(err));
}

export function deleteSection(sectionId) {
  return dispatch =>
  fetch(`/admin/api/sections/${sectionId}`, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then(res => res.json())
    .then((json) => {
      dispatch({ type: DELETE_SECTION, sectionId: json });
      dispatch(push('/admin/entries'));
    })
    .catch(err => new Error(err));
}

export function fetchSectionsIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'sections',
      request: REQUEST_SECTIONS,
      receive: RECEIVE_SECTIONS,
    };

    const query = {
      query: `{
        sections {
          _id
          title
          slug
          fields
        }
      }`,
    };

    const fetcher = new GraphQLClass(fetcherOptions, query);
    return fetcher.beginFetch(dispatch, getState());
  };
}
