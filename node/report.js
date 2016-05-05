"use strict";

class Report {
  heading(step) {
    console.log(step.text);
  }
  
  comment(step) {
    console.log(step.text);
  }

  unhandledError(error) {
    console.error(error.stack);
  }

  assertionError(step, error) {
    console.log('\x1b[31m' + "✗ " + step.assertion + '\x1b[0m');
    console.log('\x1b[31m' + error.stack + '\x1b[0m');
  }
  
  assertionPassed(step) {
    console.log('\x1b[32m' + "✓ " + step.assertion + '\x1b[0m');
  }
  
  assertionPending(step) {
    console.log('\x1b[33m' + "* " + step.assertion + '\x1b[0m');
  }

  assertionSkipped(step) {
    console.log('\x1b[34m' + "* " + step.assertion + '\x1b[0m');
  }

  allFeaturesDone() {
    console.log("ALL DONE")
  }
}

module.exports = new Report();
