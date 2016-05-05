var Feature = require('./feature');

function Runner(options) {
  this.root = options.root;
  this.args = options.args;
  this.walk = options.walk;
  this.read = options.read;
  this.report = options.report;
}

Runner.prototype.run = function() {
  var self = this;
  return self.walk('features').then(function(files) {
    var featureFiles = files.filter(function(f) { return /[^\/]+\.feature$/.test(f); });
    return self.runFeatureFiles(featureFiles);
  }).catch(function(error) {
    self.report.unhandledError(error);
  });
}

Runner.prototype.runFeatureFiles = function(featureFiles) {
  var self = this;
  var promise = new Promise(function(fulfill) { fulfill(); });
  featureFiles.forEach(function(featureFile) {
    promise = promise.then(function() {
      return self.runFeatureFile(featureFile);
    });
  });
  promise = promise.then(function() {
    return self.report.allFeaturesDone();
  });
  return promise;
}

Runner.prototype.runFeatureFile = function(featureFilePath) {
  var self = this;
  return self.read(featureFilePath).then(function(contents) {
    return new Feature(featureFilePath, contents).run(self.report);
  }).catch(function(e) {
    e.stack = "Failed to run " + featureFilePath + "\n" + e.stack;
    self.report.unhandledError(e);
  });
}

module.exports = Runner;
