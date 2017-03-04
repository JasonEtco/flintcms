import { push } from 'react-router-redux';
import GraphQLClass from '../utils/graphqlClass';
import h from '../utils/helpers';

export const REQUEST_ASSETS = 'REQUEST_ASSETS';
export const RECEIVE_ASSETS = 'RECEIVE_ASSETS';
export const NEW_ASSET = 'NEW_ASSET';

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

export function fetchAssetsIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'assets',
      request: REQUEST_ASSETS,
      receive: RECEIVE_ASSETS,
    };

    const query = {
      query: `{
        assets {
          _id
          title
          filename
          size
          width
          height
          dateCreated
        }
      }`,
    };

    const fetcher = new GraphQLClass(fetcherOptions, query);
    return fetcher.beginFetch(dispatch, getState());
  };
}
