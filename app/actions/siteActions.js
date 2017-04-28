import React from 'react';
import graphFetcher from '../utils/graphFetcher';
import { newToast, errorToasts } from './uiActions';

export const REQUEST_SITE = 'REQUEST_SITE';
export const RECEIVE_SITE = 'RECEIVE_SITE';
export const UPDATE_SITE = 'UPDATE_SITE';

/**
 * Saves updates of the general site config
 * @param {object} data
 */
export function updateSite(data) {
  return async (dispatch) => {
    const query = `mutation ($data: SiteInput!) {
      updateSite(data: $data) {
        siteUrl
        siteName
        defaultUserGroup
      }
    }`;

    return graphFetcher(query, { data })
      .then((json) => {
        const { updateSite: updatedSite } = json.data.data;
        dispatch({ type: UPDATE_SITE, updateSite: updatedSite });
        dispatch(newToast({
          message: <span>The site configuration has been has been updated!</span>,
          style: 'success',
        }));
      })
      .catch(errorToasts);
  };
}
