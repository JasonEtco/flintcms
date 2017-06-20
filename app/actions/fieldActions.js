import React from 'react';
import { push } from 'react-router-redux';
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
        handle
        instructions
        type
        dateCreated
        options
      }
    }`;

    return graphFetcher(query, { data })
      .then((json) => {
        const { addField } = json.data.data;
        dispatch({ type: NEW_FIELD, addField });
        dispatch(newToast({
          message: <span><b>{addField.title}</b> has been created!</span>,
          style: 'success',
        }));
        dispatch(push(`/settings/fields/${addField._id}`));
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
        required
      }
    }`;

    return graphFetcher(query, { _id, data })
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

    return graphFetcher(query, { _id })
      .then((json) => {
        const { removeField } = json.data.data;
        dispatch({ type: DELETE_FIELD, id: removeField._id });
        dispatch(newToast({
          message: <span><b>{removeField.title}</b> has been deleted.</span>,
          style: 'success',
        }));
      })
      .catch(errorToasts);
  };
}
