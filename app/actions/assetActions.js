import React from 'react';
import { push } from 'react-router-redux';
import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';
import h from '../utils/helpers';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_ASSETS = 'REQUEST_ASSETS';
export const RECEIVE_ASSETS = 'RECEIVE_ASSETS';
export const NEW_ASSET = 'NEW_ASSET';
export const DELETE_ASSET = 'DELETE_ASSET';

export function newAsset(formData) {
  return (dispatch, getState) =>
    fetch('/admin/api/assets', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    }).then(res => res.json())
      .then((json) => {
        dispatch(push('/admin/settings/assets'));
        const { assets } = getState();
        const { addAsset } = json.data.data;

        // Only add the new entry to store if it doesn't already exist
        // In case socket event happens first
        if (!h.checkFor(assets.assets, '_id', addAsset._id)) {
          dispatch({ type: NEW_ASSET, addAsset });
        }
      })
      .catch(err => new Error(err));
}

export function deleteAsset(id) {
  return (dispatch, getState) => {
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
        const { assets } = getState().entries;

        // Only add the delete the asset from store if it exists
        // In case socket event happens first
        if (h.checkFor(assets, '_id', removeAsset._id)) {
          dispatch({ type: DELETE_ASSET, id: removeAsset._id });
          dispatch(newToast({
            message: <span><b>{removeAsset.title}</b> has been deleted.</span>,
            style: 'success',
          }));
        }
        dispatch(push('/admin/settings/assets'));
      })
      .catch((error) => {
        if (error.response) dispatch(errorToasts(error.response.data.errors));
      });
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
