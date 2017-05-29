import { post } from 'axios';
import store from './store';

/**
 * Uses Axios to post to the GraphQL endpoint
 * @param {String} query
 * @param {Object} variables
 */
export default function graphFetcher(query, variables = {}) {
  const { id } = store.getState().socket;
  return post('/graphql', {
    query,
    variables,
    socket: id,
    withCredentials: true,
  });
}
