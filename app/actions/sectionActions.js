import { push } from 'react-router-redux';
import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';

export const REQUEST_SECTIONS = 'REQUEST_SECTIONS';
export const RECEIVE_SECTIONS = 'RECEIVE_SECTIONS';
export const NEW_SECTION = 'NEW_SECTION';
export const DELETE_SECTION = 'DELETE_SECTION';

export function newSection(title, template, fields) {
  return (dispatch) => {
    const query = {
      query: `mutation {
        addSection(data: {
          title: "${title}",
          fields: "${fields}",
          template: "${template}",
        }) {
          _id
          title
          slug
          fields
        }
      }`,
    };

    return graphFetcher(query)
      .then((json) => {
        const { addSection } = json.data;
        dispatch({ type: NEW_SECTION, json: addSection });
        dispatch(push(`/admin/entries/${addSection.slug}`));
      })
      .catch(err => new Error(err));
  };
}

export function deleteSection(id) {
  return (dispatch) => {
    const query = {
      query: `mutation ($_id:ID!) {
        removeSection(_id: $_id) {
          _id
        }
      }
      `,
      variables: {
        _id: id,
      },
    };

    return graphFetcher(query)
      .then((json) => {
        const { removeSection } = json.data;
        dispatch({ type: DELETE_SECTION, id: removeSection._id });
        dispatch(push('/admin/settings/sections'));
      })
      .catch(err => new Error(err));
  };
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
