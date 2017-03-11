import React from 'react';
import { push } from 'react-router-redux';
import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';
import h from '../utils/helpers';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_ENTRIES = 'REQUEST_ENTRIES';
export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const NEW_ENTRY = 'NEW_ENTRY';
export const UPDATE_ENTRY = 'UPDATE_ENTRY';
export const DELETE_ENTRY = 'DELETE_ENTRY';
export const ENTRY_DETAILS = 'ENTRY_DETAILS';

async function formatFields(fields, stateFields) {
  if (fields.length <= 0) return fields;

  const options = await Object.keys(fields).map((key) => {
    const fieldId = stateFields.find(field => key === field.slug)._id;
    return {
      fieldId,
      fieldSlug: key,
      value: fields[key],
    };
  });
  return options;
}

export function newEntry(title, section, status, rawOptions) {
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
          fieldSlug
          value
        }
        section
        author
        dateCreated
      }
    }`;

    const variables = {
      data: {
        title,
        section,
        status,
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
        const sectionSlug = h.getSlugFromId(sections.sections, addEntry.section);
        dispatch(push(`/admin/entries/${sectionSlug}/${addEntry._id}`));
      })
      .catch((error) => {
        if (error.response) dispatch(errorToasts(error.response.data.errors));
      });
  };
}

export function updateEntry(_id, data) {
  return async (dispatch, getState) => {
    const state = getState();
    const { title, status, ...fields } = data;
    const options = await formatFields(fields, state.fields.fields);

    const query = `mutation ($_id: ID!, $data: EntriesInput!) {
      updateEntry(_id: $_id, data: $data) {
        _id
        title
        status
        fields {
          fieldId
          fieldSlug
          value
        }
      }
    }`;

    const variables = {
      _id,
      data: {
        title,
        status,
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
      .catch(err => new Error(err));
  };
}

export function deleteEntry(id) {
  return (dispatch) => {
    const query = `mutation ($_id:ID!) {
      removeEntry(_id: $_id) {
        _id
        title
      }
    }`;

    const variables = {
      _id: id,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { removeEntry } = json.data;
        dispatch(push('/admin/entries'));
        dispatch({ type: DELETE_ENTRY, id: removeEntry._id });
        dispatch(newToast({
          message: <span><b>{removeEntry.title}</b> has been deleted.</span>,
          style: 'success',
        }));
      })
      .catch(err => new Error(err));
  };
}

export function entryDetails(_id) {
  return (dispatch) => {
    const query = `query ($_id:ID!) {
      entry(_id: $_id) {
        _id
        title
        slug
        author
        dateCreated
        section
        status
        fields {
          fieldId
          fieldSlug
          value
        }
      }
    }`;

    const variables = {
      _id,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { entry } = json.data.data;
        dispatch({ type: UPDATE_ENTRY, updateEntry: entry });
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

    const query = `{
      entries {
        _id
        title
        slug
        author
        dateCreated
        section
        status
      }
    }`;

    const fetcher = new GraphQLClass(fetcherOptions, query);
    return fetcher.beginFetch(dispatch, getState());
  };
}
