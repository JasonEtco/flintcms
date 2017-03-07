import GraphQLClass from '../utils/graphqlClass';
import graphFetcher from '../utils/graphFetcher';
import { errorToasts } from './uiActions';

export const REQUEST_FIELDS = 'REQUEST_FIELDS';
export const RECEIVE_FIELDS = 'RECEIVE_FIELDS';
export const NEW_FIELD = 'NEW_FIELD';

export function newField(title, type, instructions) {
  return (dispatch) => {
    const query = {
      query: `mutation {
        addField(data: {
          title: "${title}",
          type: "${type}",
          instructions: "${instructions}",
        }) {
          _id
          title
          slug
          instructions
          type
          dateCreated
        }
      }`,
    };

    return graphFetcher(query)
      .then((json) => {
        const { addField } = json.data.data;
        dispatch({ type: NEW_FIELD, addField });
      })
      .catch((error) => {
        if (error.response) dispatch(errorToasts(error.response.data.errors));
      });
  };
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
