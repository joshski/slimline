var fs = require('fs');

module.exports = function(path) {
  return new Promise(function(fulfill, reject) {
    fs.readFile(path, 'utf-8', function(error, contents) {
      if (error) {
        reject(error);
      } else {
        fulfill(contents);
      }
    });
  });
};
