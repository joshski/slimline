var fs = require('fs');
var path = require('path');

function walk(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      var fullPath = path.resolve(dir, file);
      fs.stat(fullPath, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(fullPath, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(dir + path.sep + file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

module.exports = function(dir) {
  return new Promise(function(fulfill, reject) {
    walk(dir, function(error, files) {
      if (error) {
        reject(error);
      } else {
        fulfill(files);
      }
    })
  })
};
