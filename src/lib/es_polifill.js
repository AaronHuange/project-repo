/**
 * String.prototype.replaceAll() polyfill
 */
if (!String.prototype.replaceAll) {
  // eslint-disable-next-line no-extend-native,func-names
  String.prototype.replaceAll = function (searchValue, replaceValue) {
    // If a regex pattern
    if (Object.prototype.toString.call(searchValue).toLowerCase() === '[object regexp]') {
      return this.replace(searchValue, replaceValue);
    }

    // If a string
    return this.replace(new RegExp(searchValue, 'g'), replaceValue);
  };
}
