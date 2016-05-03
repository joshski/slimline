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
    console.log("E " + step.assertion);
    console.error(error.stack);
  }
  
  assertionPassed(step) {
    console.log("✓ " + step.assertion);
  }
  
  assertionPending(step) {
    console.log("? " + step.assertion);
  }

  allFeaturesDone() {
    console.log("ALL DONE")
  }
}

module.exports = new Report();
