import axios from 'axios';

export default function graphFetcher(query) {
  return axios.post('/graphql', {
    query: query.query,
    withCredentials: true,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
}
