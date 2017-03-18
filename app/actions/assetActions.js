import React from 'react';
import { post } from 'axios';
import { push } from 'react-router-redux';
import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_ASSETS = 'REQUEST_ASSETS';
export const RECEIVE_ASSETS = 'RECEIVE_ASSETS';
export const NEW_ASSET = 'NEW_ASSET';
export const DELETE_ASSET = 'DELETE_ASSET';
export const INDEX_ASSETS = 'INDEX_ASSETS';

export function newAsset(formData) {
  return dispatch =>
    post('/admin/api/assets', formData, {
      withCredentials: true,
    }).then(res => res.json())
      .then((json) => {
        dispatch(push('/admin/settings/assets'));
        const { addAsset } = json.data.data;
        dispatch({ type: NEW_ASSET, addAsset });
      })
      .catch(err => new Error(err));
}

export function deleteAsset(id) {
  return (dispatch) => {
    const query = `mutation ($_id:ID!) {
      removeAsset(_id: $_id) {
        _id
      }
    }`;
    const variables = {
      _id: id,
    };

    return graphFetcher(query, variables)
      .then((json) => {
        const { removeAsset } = json.data;

        dispatch({ type: DELETE_ASSET, id: removeAsset._id });
        dispatch(newToast({
          message: <span><b>{removeAsset.title}</b> has been deleted.</span>,
          style: 'success',
        }));
        dispatch(push('/admin/settings/assets'));
      })
      .catch(errorToasts);
  };
}

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

export function fetchAssetsIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'assets',
      request: REQUEST_ASSETS,
      receive: RECEIVE_ASSETS,
    };

    const query = `{
      assets {
        _id
        title
        filename
        size
        width
        height
        dateCreated
      }
    }`;

    const fetcher = new GraphQLClass(fetcherOptions, query);
    return fetcher.beginFetch(dispatch, getState());
  };
}
