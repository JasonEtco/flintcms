import React from 'react';
import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';
import h from '../utils/helpers';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_FIELDS = 'REQUEST_FIELDS';
export const RECEIVE_FIELDS = 'RECEIVE_FIELDS';
export const NEW_FIELD = 'NEW_FIELD';
export const DELETE_FIELD = 'DELETE_FIELD';

export function newField(title, type, instructions) {
  return (dispatch) => {
    const query = `mutation ($data: FieldInput!) {
      addField(data: $data) {
        _id
        title
        slug
        instructions
        type
        dateCreated
      }
    }`;

    const variables = {
      data: {
        title,
        type,
        instructions,
      },
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { addField } = json.data.data;
        dispatch({ type: NEW_FIELD, addField });
      })
      .catch((error) => {
        if (error.response) dispatch(errorToasts(error.response.data.errors));
      });
  };
}

export function deleteField(_id) {
  return (dispatch, getState) => {
    const query = `mutation ($_id:ID!) {
      removeField(_id: $_id) {
        _id
        title
      }
    }`;

    const variables = {
      _id,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { removeField } = json.data;
        const { fields } = getState().fields;

        // Only add the delete the entry from store if it exists
        // In case socket event happens first
        if (h.checkFor(fields, '_id', removeField._id)) {
          dispatch({ type: DELETE_FIELD, id: removeField._id });
          dispatch(newToast({
            message: <span><b>{removeField.title}</b> has been deleted.</span>,
            style: 'success',
          }));
        }
      })
      .catch(err => new Error(err));
  };
}

export function fetchFieldsIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'fields',
      request: REQUEST_FIELDS,
      receive: RECEIVE_FIELDS,
    };

    const query = `{
      fields {
        _id
        title
        instructions
        type
        dateCreated
        slug
      }
    }`;

    const fetcher = new GraphQLClass(fetcherOptions, query);
    return fetcher.beginFetch(dispatch, getState());
  };
}
