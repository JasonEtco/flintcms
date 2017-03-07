import h from './helpers';

export default class GraphQLFetcher {
  constructor(options, query) {
    this.name = options.name;
    this.receive = options.receive;
    this.request = options.request;
    this.query = query;
  }

  receiveJSON(json) {
    return {
      type: this.receive,
      [this.name]: json.data[this.name],
      receivedAt: Date.now(),
    };
  }

  fetch() {
    return (dispatch) => {
      dispatch({ type: this.request });
      return fetch('/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: this.query,
        }),
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then(response => response.json())
        .then((json) => {
          h.receiveIfAuthed(json)
            .then(dispatch(this.receiveJSON(json)));
        })
        .catch(err => new Error(err));
    };
  }

  shouldFetch(state) {
    const value = state[this.name];
    if (!value[this.name]) {
      return true;
    } else if (value.isFetching) {
      return false;
    }

    return value.didInvalidate;
  }

  beginFetch(dispatch, state) {
    if (this.shouldFetch(state)) {
      return dispatch(this.fetch(dispatch));
    }

    return false;
  }
}
