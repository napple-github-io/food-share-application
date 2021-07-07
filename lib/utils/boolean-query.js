// make sure to keep file names consistent
module.exports = function booleanQuery(obj, keyPrefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    acc[`${keyPrefix}${key}`] = !!obj[key];
  }, {});
};
