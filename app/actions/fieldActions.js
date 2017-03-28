import React from 'react';
import { push } from 'react-router-redux';
import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_FIELDS = 'REQUEST_FIELDS';
export const RECEIVE_FIELDS = 'RECEIVE_FIELDS';
export const NEW_FIELD = 'NEW_FIELD';
export const DELETE_FIELD = 'DELETE_FIELD';
export const UPDATE_FIELD = 'UPDATE_FIELD';

/**
 * Creates a new Field
 * @param {Object} data
 */
export function newField(data) {
  return (dispatch) => {
    const query = `mutation ($data: FieldInput!) {
      addField(data: $data) {
        _id
        title
        slug
        instructions
        type
        dateCreated
        options
      }
    }`;

    const variables = {
      data,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { addField } = json.data.data;
        dispatch({ type: NEW_FIELD, addField });
        dispatch(newToast({
          message: <span><b>{addField.title}</b> has been created!</span>,
          style: 'success',
        }));
        dispatch(push(`/admin/settings/fields/${addField._id}`));
      })
      .catch(errorToasts);
  };
}
/**
 * Updates a Field
 * @param {String} _id
 * @param {Object} data
 */
export function updateField(_id, data) {
  return (dispatch) => {
    const query = `mutation ($_id: ID!, $data: FieldInput!) {
      updateField(_id: $_id, data: $data) {
        _id
        title
        slug
        instructions
        type
        dateCreated
        options
      }
    }`;

    const variables = {
      _id,
      data,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { updateField: updatedField } = json.data.data;
        dispatch({ type: UPDATE_FIELD, updatedField });
        dispatch(newToast({
          message: <span><b>{updatedField.title}</b> has been updated!</span>,
          style: 'success',
        }));
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
        handle
      }
    }`;

    const fetcher = new GraphQLClass(fetcherOptions, query);
    return fetcher.beginFetch(dispatch, getState());
  };
}
