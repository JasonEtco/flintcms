import { browserHistory } from 'react-router';

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
  sortArrayOfObjByString(arr, str, direction) {
    return arr.sort((a, b) => {
      if ((a[str].value || a[str]) < (b[str].value || b[str])) return direction === 'ASC' ? -1 : 1;
      if ((a[str].value || a[str]) > (b[str].value || b[str])) return direction === 'ASC' ? 1 : -1;
      return 0;
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
};

export default helpers;
