import { browserHistory } from 'react-router';
import moment from 'moment';

const helpers = {
  getSlugFromId(arr, id) {
    return arr.find(v => v._id === id).slug;
  },
  getIdFromSlug(arr, slug) {
    return arr.find(v => v.slug === slug)._id;
  },
  getPropFromProp(arr, have, get) {
    const keys = Object.keys(have);
    return arr.find(v => v[keys[0]] === have[keys[0]])[get];
  },
  receiveIfAuthed(json) {
    return new Promise((resolve) => {
      if (json.status === 401 && json.redirect) {
        browserHistory.push(json.redirect);
      } else {
        resolve(json);
      }
    });
  },
  shuffle(arr) {
    const array = arr;
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },
  isDate(str) {
    return !!Date.parse(str);
  },
  addToArrayAtIndex(arr, item, index) {
    return [
      ...arr.slice(0, index),
      item,
      ...arr.slice(index + 1),
    ];
  },
  sortArrayOfObjByString(arr, key, direction = 'ASC') {
    return arr.sort((a, b) => {
      if (!Object.prototype.hasOwnProperty.call(a, key) ||
        !Object.prototype.hasOwnProperty.call(b, key)) {
        return 0;
      }

      const aVal = a[key].value || a[key];
      const bVal = b[key].value || b[key];

      const varA = (typeof aVal === 'string') ?
        aVal.toUpperCase() : aVal;
      const varB = (typeof bVal === 'string') ?
        bVal.toUpperCase() : bVal;

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (direction === 'DESC') ?
        (comparison * -1) : comparison
      );
    });
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
  formatStringWithCode(str) {
    return str.replace(/`(\S+)`/g, '<code>$1</code>');
  },
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  arrayMove(arr, oldIndex, newIndex) {
    const arrCopy = [...arr];

    if (newIndex >= arrCopy.length) {
      const k = newIndex - arrCopy.length;
      while ((k - 1) + 1) {
        arrCopy.push(undefined);
      }
    }
    arrCopy.splice(newIndex, 0, arrCopy.splice(oldIndex, 1)[0]);
    return arrCopy; // for testing purposes
  },
  checkFor(arr, f, w) {
    return arr.some(v => v.f === w);
  },
  formatBytes(bytes, decimals) {
    if (bytes === 0) return '0 Bytes';
    const k = 1000;
    const dm = decimals + 1 || 3;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
  },
  formatDate(date) {
    const dateObj = moment(new Date(date));
    if (dateObj.diff(Date.now(), 'weeks') < -1) return dateObj.format('DD/MM/YYYY');
    return dateObj.fromNow();
  },
  reduceToObj(arr, key, value, start = {}) {
    return arr
      .reduce((prev, curr) =>
      Object.assign({}, prev, { [curr[key]]: curr[value] }), start);
  },
};

export default helpers;
