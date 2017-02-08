import { browserHistory } from 'react-router';

const helpers = {
  receiveIfAuthed(json) {
    if (json.status === 401 && json.redirect) {
      browserHistory.push(json.redirect);
    }
  },
  filterObj(str, obj) {
    if (str in obj) {
      return false;
    }
    return true;
  },
  slugify(str) {
    return str
      .toLowerCase()
      .replace(/^\s+|\s+$/g, '')   // Trim leading/trailing whitespace
      .replace(/[-\s]+/g, '-')     // Replace spaces with dashes
      .replace(/[^a-z0-9-]/g, '')  // Remove disallowed symbols
      .replace(/--+/g, '-');
  },
  getUrlParameter(name, str) {
    const filteredName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${filteredName}=([^&#]*)`);
    const results = regex.exec(str || location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },
};

export default helpers;
