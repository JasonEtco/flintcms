export default function graphFetcher(query) {
  return fetch('/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then(res => res.json());
}
