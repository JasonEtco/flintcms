import moment from 'moment';

/**
 * Gets the Slug of an object from it's ID
 * @param {Object[]} arr - Array of Objects
 * @param {String} id - Mongo ID
 * @returns {String}
 */
export function getSlugFromId(arr, id) {
  return arr.find(v => v._id === id).slug;
}

/**
 * Gets the ID of an object from it's Slug
 * @param {Object[]} arr - Array of Objects
 * @param {String} slug - Slug
 * @returns {String}
 */
export function getIdFromSlug(arr, slug) {
  return arr.find(v => v.slug === slug)._id;
}

/**
 * Get a property in an object from another property
 * @param {Object[]} arr - Array of Objects
 * @param {String} have - The key that you have
 * @param {String} get - The value's key that you want
 * @returns {Any}
 */
export function getPropFromProp(arr, have, get) {
  const keys = Object.keys(have);
  return arr.find(v => v[keys[0]] === have[keys[0]])[get];
}

/**
 * Randomizes the order of an array
 * @param {Any[]} arr
 * @returns {Any[]}
 */
export function shuffle(arr) {
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
}

/**
 * Determines if a string is or is not a valid date
 * @param {String} str - Date String
 * @returns {Boolean}
 */
export function isDate(str) {
  return !!Date.parse(str);
}

/**
 * Adds something to array at a given index, immutably.
 * @param {Any[]} arr
 * @param {Any} item
 * @param {Number} index
 * @returns {Any[]}
 */
export function addToArrayAtIndex(arr, item, index) {
  return [
    ...arr.slice(0, index),
    item,
    ...arr.slice(index + 1),
  ];
}

/**
 * Sorts an Array of Objects by the given Key
 * @param {Object[]} arr
 * @param {String} key - Key to sort the array by
 * @param {String} direction - Either ASC or DESC
 * @returns {Object[]}
 */
export function sortArrayOfObjByString(arr, key, direction = 'ASC') {
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
}

/**
 * Filters out objects in an array of objects
 * @param {String} str - Key
 * @param {Object} obj - Object
 * @returns {Boolean}
 */
export function filterObj(str, obj) {
  if (str in obj) {
    return false;
  }
  return true;
}

/**
 * Converts a string to a kebab-cased slug
 * @param {String} str - String to slugify
 * @returns {String}
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/^\s+|\s+$/g, '')   // Trim leading/trailing whitespace
    .replace(/[-\s]+/g, '-')     // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, '')  // Remove disallowed symbols
    .replace(/--+/g, '-');
}

/**
 * Gets a URL parameter from a string
 * @param {String} name - Name of the URL Parameter
 * @param {String} str - String to check
 * @returns {String}
 */
export function getUrlParameter(name, str = location.search) {
  const filteredName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${filteredName}=([^&#]*)`);
  const results = regex.exec(str);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Replaces ` with <code> tags
 * @param {String} str
 * @returns {String}
 */
export function formatStringWithCode(str) {
  return str.replace(/`(\S+)`/g, '<code>$1</code>');
}

/**
 * Capitalizes the first word of a string
 * @param {String} str
 * @returns {String}
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Moves a value in an array from one index to another
 * @param {Any[]} arr
 * @param {Number} oldIndex - Starting position
 * @param {Number} newIndex - Desired position
 */
export function arrayMove(arr, oldIndex, newIndex) {
  const arrCopy = [...arr];

  if (newIndex >= arrCopy.length) {
    const k = newIndex - arrCopy.length;
    while ((k - 1) + 1) {
      arrCopy.push(undefined);
    }
  }
  arrCopy.splice(newIndex, 0, arrCopy.splice(oldIndex, 1)[0]);
  return arrCopy; // for testing purposes
}

export function checkFor(arr, f, w) {
  return arr.some(v => v.f === w);
}

/**
 * Formats raw bytes into legible text
 * @param {Number} bytes - Raw bytes
 * @param {Number} decimals - Number of decimals
 * @returns {String}
 */
export function formatBytes(bytes, decimals) {
  if (bytes === 0) return '0 Bytes';
  const k = 1000;
  const dm = decimals + 1 || 3;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Formats a date with either fromNow or the full date
 * @param {String} date - Date string
 * @returns {String}
 */
export function formatDate(date) {
  const dateObj = moment(new Date(date));
  if (dateObj.diff(Date.now(), 'weeks') < -1) return dateObj.format('DD/MM/YYYY');
  return dateObj.fromNow();
}

/**
 * Reduces an Array of Objects to Key/Value pairs
 * @param {Object[]} arr - Array of Objects
 * @param {String} key - String to be the key
 * @param {String} value - String to grab the value
 * @param {Object} start - Beginning of reduce method
 */
export function reduceToObj(arr, key, value, start = {}) {
  return arr
    .reduce((prev, curr) =>
    Object.assign({}, prev, { [curr[key]]: curr[value] }), start);
}

/**
 * Truncates a string
 * @param {String} str - String to truncate
 * @param {Number} maxChar - Maximum number of characters
 * @param {String} append - String to append if necessary
 */
export function truncate(str, maxChar, append = '...') {
  return str.substring(0, maxChar) + (str.length > maxChar ? append : '');
}
