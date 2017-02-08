export function addNewSection(title) {
  fetch('/admin/api/section', {
    method: 'POST',
    body: JSON.stringify({ title }),
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then(res => res.json())
    .then(json => console.log(json));
}
