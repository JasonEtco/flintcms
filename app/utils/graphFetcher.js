import { post } from 'axios';
import store from './store';

export default function graphFetcher(query, variables = {}) {
  const { id } = store.getState().socket;
  return post('/graphql', {
    query,
    variables,
    socket: id,
    withCredentials: true,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
}
