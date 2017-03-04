import React from 'react';
import { push } from 'react-router-redux';
import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';
import h from '../utils/helpers';
import { newToast } from './uiActions';

export const REQUEST_ENTRIES = 'REQUEST_ENTRIES';
export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const NEW_ENTRY = 'NEW_ENTRY';
export const UPDATE_ENTRY = 'UPDATE_ENTRY';
export const DELETE_ENTRY = 'DELETE_ENTRY';

async function formatFields(fields, stateFields) {
  if (fields.length <= 0) return fields;

  const options = await Object.keys(fields).map((key) => {
    const fieldId = stateFields.find(field => key === field.slug)._id;
    return `{
      fieldId: ${JSON.stringify(fieldId)},
      fieldSlug: ${JSON.stringify(key)},
      value: ${JSON.stringify(fields[key])},
    }`;
  });
  return options;
}

export function newEntry(title, section, rawOptions) {
  return async (dispatch, getState) => {
    const { entries, fields, sections, user } = getState();
    const options = await formatFields(rawOptions, fields.fields);

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
        const { addEntry } = json.data.data;

        // Only add the new entry to store if it doesn't already exist
        // In case socket event happens first
        if (!h.checkFor(entries.entries, '_id', addEntry._id)) {
          dispatch({ type: NEW_ENTRY, addEntry });
        }

        const sectionSlug = h.getSlugFromId(sections.sections, addEntry.section);
        dispatch(push(`/admin/entries/${sectionSlug}/${addEntry._id}`));
      })
      .catch((error) => {
        if (error.response) {
          error.response.data.errors.forEach(err => dispatch(newToast({
            message: err.message,
            style: 'error',
          })));
        }
      });
  };
}

export function updateEntry(_id, data) {
  return async (dispatch, getState) => {
    const state = getState();
    const { title, ...fields } = data;
    const options = await formatFields(fields, state.fields.fields);

    const query = {
      query: `mutation ($_id: ID!) {
        updateEntry(_id: $_id, data: {
          title: "${title}",
          fields: [${options}]
        }) {
          _id
          title
          fields {
            fieldId
            fieldSlug
            value
          }
        }
      }`,
      variables: {
        _id,
      },
    };

    return graphFetcher(query)
      .then((json) => {
        const updatedEntry = json.data.data.updateEntry;
        dispatch({ type: UPDATE_ENTRY, updateEntry: updatedEntry });
        dispatch(newToast({
          message: <span><b>{updatedEntry.title}</b> has been updated!</span>,
          style: 'success',
        }));
      })
      .catch(err => new Error(err));
  };
}

export function deleteEntry(id) {
  return (dispatch, getState) => {
    const query = {
      query: `mutation ($_id:ID!) {
        removeEntry(_id: $_id) {
          _id
          title
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
        const { entries } = getState().entries;

        // Only add the delete the entry from store if it exists
        // In case socket event happens first
        if (h.checkFor(entries, '_id', removeEntry._id)) {
          dispatch({ type: DELETE_ENTRY, id: removeEntry._id });
          dispatch(newToast({
            message: <span><b>{removeEntry.title}</b> has been deleted.</span>,
            style: 'success',
          }));
        }
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
