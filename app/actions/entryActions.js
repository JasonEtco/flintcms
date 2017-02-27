import { push } from 'react-router-redux';
import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';
import h from '../utils/helpers';

export const REQUEST_ENTRIES = 'REQUEST_ENTRIES';
export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const NEW_ENTRY = 'NEW_ENTRY';

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
        dispatch({ type: NEW_ENTRY, json: addEntry });
        dispatch(push(`/admin/entries/${h.getSlugFromId(sections.sections, addEntry.section)}/${addEntry._id}`));
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
