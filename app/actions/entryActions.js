import { push } from 'react-router-redux';
import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';
import h from '../utils/helpers';
import { newToast } from './uiActions';

export const REQUEST_ENTRIES = 'REQUEST_ENTRIES';
export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const NEW_ENTRY = 'NEW_ENTRY';
export const DELETE_ENTRY = 'DELETE_ENTRY';

export function newEntry(title, section, rawOptions) {
  return (dispatch, getState) => {
    const { fields, sections, user } = getState();

    const options = Object.keys(rawOptions).map((key) => {
      const fieldId = fields.fields.find(field => key === field.slug)._id;
      return `{
        fieldId: ${JSON.stringify(fieldId)},
        fieldSlug: ${JSON.stringify(key)},
        value: ${JSON.stringify(rawOptions[key])},
      }`;
    });

    const query = {
      query: `mutation {
        addEntry(data: {
          title: "${title}",
          section: "${section}",
          fields: [${options}],
          author: "${user._id}",
        }) {
          _id
          title
          slug
          fields {
            fieldId
            fieldSlug
            value
          }
          section
          author
          dateCreated
        }
      }`,
    };

    return graphFetcher(query)
      .then((json) => {
        const { addEntry } = json.data;
        const { entries } = getState().entries;

        // Only add the new entry to store if it doesn't already exist
        // In case socket event happens first
        if (!h.checkFor(entries, '_id', addEntry._id)) {
          dispatch({ type: NEW_ENTRY, json: addEntry });
        }
        dispatch(push(`/admin/entries/${h.getSlugFromId(sections.sections, addEntry.section)}/${addEntry._id}`));
      })
      .catch(err => new Error(err));
  };
}

export function deleteEntry(id) {
  return (dispatch) => {
    const query = {
      query: `mutation ($_id:ID!) {
        removeEntry(_id: $_id) {
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
        const { removeEntry } = json.data;
        dispatch({ type: DELETE_ENTRY, id: removeEntry._id });
        dispatch(newToast({
          message: 'Entry deleted',
          style: 'success',
        }));
        dispatch(push('/admin/entries'));
      })
      .catch(err => new Error(err));
  };
}


export function fetchEntriesIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'entries',
      request: REQUEST_ENTRIES,
      receive: RECEIVE_ENTRIES,
    };

    const query = {
      query: `{
        entries {
          _id
          title
          slug
          author
          dateCreated
          section
          fields {
            fieldId
            fieldSlug
            value
          }
        }
      }`,
    };

    const fetcher = new GraphQLClass(fetcherOptions, query);
    return fetcher.beginFetch(dispatch, getState());
  };
}
