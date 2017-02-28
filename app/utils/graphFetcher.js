import axios from 'axios';

export default function graphFetcher({ query, variables }) {
  return axios.post('/graphql', {
    query,
    variables,
    withCredentials: true,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
}
