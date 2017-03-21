import { post } from 'axios';
import h from './helpers';

/**
 * GraphQL Fetcher class
 * Goes through the motions of requesting then receiving
 * data, then dispatching the relevant reducer to affect
 * the store's state.
 * @class
 */
export default class GraphQLFetcher {
  /**
   * Constructor for the GraphQLFetcher
   * @constructs
   * @param {Object} options
   * @param {String} options.receive
   * @param {String} options.request
   * @param {String} options.name
   * @param {String} query
   */
  constructor(options, query) {
    this.name = options.name;
    this.receive = options.receive;
    this.request = options.request;
    this.query = query;
  }

  /**
   * Dispatches reducer to receive JSON
   * @param {Object} json
   */
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
      return post('/graphql', {
        query: this.query,
        withCredentials: true,
      })
        .then((json) => {
          h.receiveIfAuthed(json.data)
            .then(dispatch(this.receiveJSON(json.data)));
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
