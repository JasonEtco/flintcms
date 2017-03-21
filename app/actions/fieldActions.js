import React from 'react';
import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_FIELDS = 'REQUEST_FIELDS';
export const RECEIVE_FIELDS = 'RECEIVE_FIELDS';
export const NEW_FIELD = 'NEW_FIELD';
export const DELETE_FIELD = 'DELETE_FIELD';

/**
 * Creates a new Field
 * @param {String} title
 * @param {String} type
 * @param {String} instructions
 */
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
      .catch(errorToasts);
  };
}

/**
 * Deletes a Field from the database.
 * @param {String} _id - Mongo ID of Field.
 */
export function deleteField(_id) {
  return (dispatch) => {
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
        dispatch({ type: DELETE_FIELD, id: removeField._id });
        dispatch(newToast({
          message: <span><b>{removeField.title}</b> has been deleted.</span>,
          style: 'success',
        }));
      })
      .catch(errorToasts);
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
