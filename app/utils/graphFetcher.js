import axios from 'axios';
import store from './store';

export default function graphFetcher(query, variables = {}) {
  const { id } = store.getState().socket;
  return axios.post('/graphql', {
    query,
    variables,
    socket: id,
    withCredentials: true,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
}
