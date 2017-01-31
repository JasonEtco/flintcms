const helpers = {
  rando(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  filterObj(str, obj) {
    if (str in obj) {
      return false;
    }
    return true;
  },
  takeWhile(arr, f) {
    let ok = true;
    return arr.filter(e => ok && (ok = f(e)));
  },
  dropWhile(arr, f) {
    let ok = false;
    return arr.filter(e => ok || (ok = !f(e)));
  },
  zip(...arrs) {
    const resultLength = Math.min(...arrs.map(a => a.length));
    return new Array(resultLength)
      .fill(0)
      .map((_, i) => arrs.map(a => a[i]));
  },
  slugify(str) {
    return str
      .toLowerCase()
      .replace(/^\s+|\s+$/g, '')   // Trim leading/trailing whitespace
      .replace(/[-\s]+/g, '-')     // Replace spaces with dashes
      .replace(/[^a-z0-9-]/g, '')  // Remove disallowed symbols
      .replace(/--+/g, '-');
  },
  shuffleStr(str) {
    const a = str.split('');
    const n = a.length;

    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join('');
  },
  getUrlParameter(name, str) {
    const filteredName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${filteredName}=([^&#]*)`);
    const results = regex.exec(str || location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },
};

export default helpers;
