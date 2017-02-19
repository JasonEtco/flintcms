import Fetcher from '../utils/fetchClass';

export const REQUEST_ASSETS = 'REQUEST_ASSETS';
export const RECEIVE_ASSETS = 'RECEIVE_ASSETS';
export const NEW_ASSET = 'NEW_ASSET';

export function newAsset(title, asset) {
  return dispatch =>
    fetch('/admin/api/assets', {
      method: 'POST',
      body: JSON.stringify({ title, asset }),
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(res => res.json())
      .then((json) => {
        dispatch({ type: NEW_ASSET, json });
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

    const fetcher = new Fetcher(fetcherOptions);
    return fetcher.beginFetch(dispatch, getState());
  };
}
