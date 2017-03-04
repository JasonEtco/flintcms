import GraphQLClass from '../utils/graphqlClass';

export const REQUEST_ASSETS = 'REQUEST_ASSETS';
export const RECEIVE_ASSETS = 'RECEIVE_ASSETS';
export const NEW_ASSET = 'NEW_ASSET';

export function newAsset(formData) {
  return dispatch =>
    fetch('/admin/api/assets', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
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
