import React from 'react';
import { push } from 'react-router-redux';
import graphFetcher from '../utils/graphFetcher';
import { getSlugFromId } from '../utils/helpers';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_ENTRIES = 'REQUEST_ENTRIES';
export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const NEW_ENTRY = 'NEW_ENTRY';
export const UPDATE_ENTRY = 'UPDATE_ENTRY';
export const DELETE_ENTRY = 'DELETE_ENTRY';
export const ENTRY_DETAILS = 'ENTRY_DETAILS';

/**
 * Formats fields by key/value pairs into a larger, more descriptive object
 * @param {Object} fields
 * @param {Object} stateFields
 *
 * @typedef {Object} FieldObject
 * @property {String} fieldId - Mongo ID of the Field
 * @property {String} handle - Slug of the Field's title
 * @property {Any} value - the value for this field in the Entry
 *
 * @returns {FieldObject}
 */
async function formatFields(fields, stateFields) {
  if (fields.length <= 0) return fields;

  const options = await Object.keys(fields).map((key) => {
    const fieldId = stateFields.find(field => key === field.handle)._id;
    return {
      fieldId,
      handle: key,
      value: fields[key],
    };
  });
  return options;
}

/**
 * Creates a new Entry
 * @param {string} title
 * @param {string} section
 * @param {string} status
 * @param {string} dateCreated
 * @param {object} rawOptions
 */
export function newEntry(title, section, status, dateCreated, rawOptions) {
  return async (dispatch, getState) => {
    const { fields, sections, user } = getState();
    const options = await formatFields(rawOptions, fields.fields);

    const query = `mutation ($data: EntriesInput!) {
      addEntry(data: $data) {
        _id
        title
        slug
        status
        fields {
          fieldId
          handle
          value
        }
        section
        author {
          username
        }
        dateCreated
      }
    }`;

    const variables = {
      data: {
        title,
        section,
        status,
        dateCreated,
        fields: options,
        author: user._id,
      },
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { addEntry } = json.data.data;

        dispatch({ type: NEW_ENTRY, addEntry });
        dispatch(newToast({
          message: <span><b>{addEntry.title}</b> has been created!</span>,
          style: 'success',
        }));
        const sectionSlug = getSlugFromId(sections.sections, addEntry.section);
        dispatch(push(`/admin/entries/${sectionSlug}/${addEntry._id}`));
      })
      .catch(errorToasts);
  };
}

/**
 * Saves updates of an existing Entry
 * @param {string} _id
 * @param {object} data
 */
export function updateEntry(_id, data) {
  return async (dispatch, getState) => {
    const state = getState();
    const { title, status, dateCreated, ...fields } = data;
    const options = await formatFields(fields, state.fields.fields);

    const query = `mutation ($_id: ID!, $data: EntriesInput!) {
      updateEntry(_id: $_id, data: $data) {
        _id
        title
        status
        fields {
          fieldId
          handle
          value
        }
      }
    }`;

    const variables = {
      _id,
      data: {
        title,
        status,
        dateCreated,
        fields: options,
      },
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const updatedEntry = json.data.data.updateEntry;
        dispatch({ type: UPDATE_ENTRY, updateEntry: updatedEntry });
        dispatch(newToast({
          message: <span><b>{updatedEntry.title}</b> has been updated!</span>,
          style: 'success',
        }));
      })
      .catch(errorToasts);
  };
}

/**
 * Posts to GraphQL to delete an Entry
 * @param {string} _id
 */
export function deleteEntry(_id) {
  return (dispatch) => {
    const query = `mutation ($_id:ID!) {
      removeEntry(_id: $_id) {
        _id
        title
      }
    }`;

    return graphFetcher(query, { _id })
      .then((json) => {
        const { removeEntry } = json.data.data;
        dispatch({ type: DELETE_ENTRY, id: removeEntry._id });
        dispatch(push('/admin/entries'));
        dispatch(newToast({
          message: <span><b>{removeEntry.title}</b> has been deleted.</span>,
          style: 'success',
        }));
      })
      .catch(errorToasts);
  };
}

/**
 * Gets the details (fields object) of an Entry
 * @param {string} _id - Mongo ID of Entry.
 */
export function entryDetails(_id) {
  return (dispatch) => {
    const query = `query ($_id:ID!) {
      entry (_id: $_id) {
        fields {
          fieldId
          handle
          value
        }
      }
    }`;

    return graphFetcher(query, { _id })
      .then((json) => {
        const { entry } = json.data.data;
        dispatch({ type: UPDATE_ENTRY, updateEntry: { _id, ...entry } });
      })
      .catch(errorToasts);
  };
}
