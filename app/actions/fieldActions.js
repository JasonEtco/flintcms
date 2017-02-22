import GraphQLClass from '../utils/graphqlClass';

export const REQUEST_FIELDS = 'REQUEST_FIELDS';
export const RECEIVE_FIELDS = 'RECEIVE_FIELDS';
export const NEW_FIELD = 'NEW_FIELD';

export function newField(title, type, instructions) {
  return dispatch =>
    fetch('/admin/api/fields', {
      method: 'POST',
      body: JSON.stringify({ title, type, instructions }),
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(res => res.json())
      .then(json => dispatch({ type: NEW_FIELD, json }))
      .catch(err => new Error(err));
}

export function fetchFieldsIfNeeded() {
  return (dispatch, getState) => {
    const fetcherOptions = {
      name: 'fields',
      request: REQUEST_FIELDS,
      receive: RECEIVE_FIELDS,
    };

    const query = {
      query: `{
        fields {
          _id
          title
          instructions
          type
          dateCreated
          slug
        }
      }`,
    };

    const fetcher = new GraphQLClass(fetcherOptions, query);
    return fetcher.beginFetch(dispatch, getState());
  };
}
