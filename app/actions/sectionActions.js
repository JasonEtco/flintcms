import React from 'react';
import { push } from 'react-router-redux';
import graphFetcher from '../utils/graphFetcher';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_SECTIONS = 'REQUEST_SECTIONS';
export const RECEIVE_SECTIONS = 'RECEIVE_SECTIONS';
export const NEW_SECTION = 'NEW_SECTION';
export const DELETE_SECTION = 'DELETE_SECTION';
export const UPDATE_SECTION = 'UPDATE_SECTION';

/**
 * Creates a new Section
 * @param {Object} param0 - New Section data
 * @param {String} param0.title
 * @param {String} param0.template
 * @param {Array} param0.fields
 */
export function newSection({ title, template, fields }) {
  return (dispatch) => {
    const query = `mutation ($data: SectionsInput!) {
        addSection(data: $data) {
          _id
          template
          title
          slug
          fields
          dateCreated
        }
      }`;

    const variables = {
      data: {
        title,
        fields,
        template,
      },
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { addSection } = json.data.data;
        dispatch({ type: NEW_SECTION, addSection });
        dispatch(newToast({
          message: <span><b>{addSection.title}</b> has been created!</span>,
          style: 'success',
        }));
        dispatch(push(`/admin/entries/${addSection.slug}`));
      })
      .catch(errorToasts);
  };
}

/**
 * Updates a Section document.
 * @param {String} _id - Mongo ID of the Section to update.
 * @param {Object} param1 - Section Object
 * @param {String} param1.title
 * @param {String} param1.template
 * @param {Array} param1.fields
 */
export function updateSection(_id, { title, template, fields }) {
  return async (dispatch) => {
    const query = `mutation ($_id: ID!, $data: SectionsInput!) {
      updateSection(_id: $_id, data: $data) {
        _id
        template
        title
        slug
        fields
      }
    }`;

    const variables = {
      _id,
      data: {
        title,
        template,
        fields,
      },
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const updatedSection = json.data.data.updateSection;
        dispatch({ type: UPDATE_SECTION, updateSection: updatedSection });
        dispatch(newToast({
          message: <span><b>{updatedSection.title}</b> has been updated!</span>,
          style: 'success',
        }));
      })
      .catch(errorToasts);
  };
}

/**
 * Deletes a Section from the database.
 * @param {String} _id - Mongo ID of Section.
 */
export function deleteSection(_id) {
  return (dispatch) => {
    const query = `mutation ($_id:ID!) {
      removeSection(_id: $_id) {
        _id
        title
      }
    }`;

    return graphFetcher(query, { _id })
      .then((json) => {
        const { removeSection } = json.data.data;
        dispatch({ type: DELETE_SECTION, _id: removeSection._id });
        dispatch(newToast({
          message: <span><b>{removeSection.title}</b> has been deleted!</span>,
          style: 'success',
        }));
        dispatch(push('/settings/sections'));
      })
      .catch(errorToasts);
  };
}
