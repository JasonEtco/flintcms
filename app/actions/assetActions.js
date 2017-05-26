import React from 'react';
import { post } from 'axios';
import { push } from 'react-router-redux';
import graphFetcher from '../utils/graphFetcher';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_ASSETS = 'REQUEST_ASSETS';
export const RECEIVE_ASSETS = 'RECEIVE_ASSETS';
export const NEW_ASSET = 'NEW_ASSET';
export const UPDATE_ASSET = 'UPDATE_ASSET';
export const DELETE_ASSET = 'DELETE_ASSET';
export const INDEX_ASSETS = 'INDEX_ASSETS';

/**
 * Uploads a new Asset to the file system and
 * adds it to the database.
 * @param {Object} formData - Form formData
 */
export function newAsset(formData) {
  return dispatch =>
    post('/admin/api/assets', formData, {
      withCredentials: true,
    }).then(res => res.json())
      .then((json) => {
        dispatch(push('/settings/assets'));
        const { addAsset } = json.data.data;
        dispatch({ type: NEW_ASSET, addAsset });
      })
      .catch(errorToasts);
}

/**
 * Uploads a new Asset to the file system and
 * adds it to the database.
 * @param {Object} formData - Form formData
 */
export function updateAsset(asset, _id) {
  return (dispatch) => {
    const query = `mutation ($data: AssetInput!, $_id: ID!) {
      updateAsset(_id: $_id, data: $data) {
        title
      }
    }`;

    return graphFetcher(query, { _id, data: asset })
      .then(({ data }) => {
        const { updateAsset: updatedAsset } = data.data;

        dispatch({ type: UPDATE_ASSET, _id, updatedAsset });
        dispatch(newToast({
          message: <span><b>{updatedAsset.title}</b> has been deleted.</span>,
          style: 'success',
        }));
      })
      .catch(errorToasts);
  };
}

/**
 * Deletes an Asset from the database and the local file system
 * @param {String} _id - Mongo ID of the Asset
 */
export function deleteAsset(_id) {
  return (dispatch) => {
    const query = `mutation ($_id:ID!) {
      removeAsset(_id: $_id) {
        _id
      }
    }`;
    const variables = {
      _id,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { removeAsset } = json.data;

        dispatch({ type: DELETE_ASSET, id: removeAsset._id });
        dispatch(newToast({
          message: <span><b>{removeAsset.title}</b> has been deleted.</span>,
          style: 'success',
        }));
        dispatch(push('/settings/assets'));
      })
      .catch(errorToasts);
  };
}

/**
 * Re-indexs all assets; deletes non-existant files from the DB
 * and adds DB entries for new files that aren't already there
 */
export function indexAssets() {
  return (dispatch) => {
    const query = `mutation {
      indexAssets {
        savedFiles {
          _id
          title
          filename
          size
          width
          height
          dateCreated
        }
        removedFiles {
          _id
        }
      }
    }`;

    return graphFetcher(query)
      .then((json) => {
        const { savedFiles, removedFiles } = json.data.data.indexAssets;
        dispatch(newToast('Assets have been re-indexed!'));

        savedFiles.forEach((addAsset) => {
          dispatch({ type: NEW_ASSET, addAsset });
        });
        removedFiles.forEach(o => dispatch({ type: DELETE_ASSET, id: o._id }));
      })
      .catch(errorToasts);
  };
}
