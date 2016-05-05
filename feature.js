function Feature(path, contents) {
  this.path = path;
  this.requireImplementation();
  this.parseSteps(path, contents);
}

Feature.prototype.requireImplementation = function() {
  var implementationPath = './' + this.path + '.js';
  try {
    var FeatureClass = require(implementationPath);
    this.implementation = new FeatureClass();
  } catch (e) {
    if (e.code == 'MODULE_NOT_FOUND') {
      this.implementation = {};
    } else {
      throw new Error('Failed to require ' + implementationPath + "\n" + e.stack);
    }
  }
}

Feature.prototype.parseSteps = function(path, contents) {
  var lines = contents.split("\n");
  var steps = [];
  lines.forEach(function(line, index) {
    var step = { file: path, line: index + 1, text: line };
    if (line[0] == '*') {
      step.type = 'assertion';
      step.assertion = line.replace(/^\*\s*/, "");
    } else if (line.length == 0 || line[0] == ' ') {
      step.type = 'comment';
      step.comment = line;
    } else {
      step.type = 'heading'
      step.heading = line.replace(/:$/, '');
    }
    steps.push(step);
  });
  this.steps = steps;
}

Feature.prototype.run = function(report) {
  var self = this;
  var promise = new Promise(function(fulfill) { fulfill(); });
  var headingStep = null;
  this.steps.forEach(function(step) {
    if (step.heading) {
      headingStep = step;
      promise = promise.then(function() {
        report.heading(step);
      });
    } else if (headingStep && step.type == 'assertion') {
      step.headingStep = headingStep;
      promise = promise.then(function() {
        return self.runAssertion(step, report);
      });
    } else {
      promise = promise.then(function() {
        report.comment(step);
      });
    }
  });
  return promise;
}

Feature.prototype.runAssertion = function(step, report) {
  var self = this;
  return new Promise(function(fulfill, reject) {
    function assert(assertionMethod) {
      var assertionResult = assertionMethod.apply(self.implementation);
      if (typeof(assertionResult.then) == 'function') {
        assertionResult.then(function() {
          report.assertionPassed(step);
          fulfill();
        }).catch(function(e) {
          report.assertionError(e);
          fulfill();
        });
      } else {
        report.assertionPassed(step);
        fulfill();
      }
    }

    var assertionMethod = self.implementation[step.assertion];
    if (assertionMethod) {
      var headingMethod = self.implementation[step.headingStep.heading];
      if (headingMethod) {
        var headingResult = headingMethod.apply(self.implementation);
        if (typeof(headingResult.then) == 'function') {
          headingResult.then(function() {
            assert(assertionMethod);
          }).catch(function(e) {
            report.assertionError(step, e);
            fulfill();
          });
        } else {
          assert(assertionMethod);
        }
      } else {
        report.assertionSkipped(step);
        fulfill();
      }
    } else {
      report.assertionPending(step);
      fulfill();
    }
  }).catch(function(e) {
    report.assertionError(step, e);
  });
}

module.exports = Feature;
