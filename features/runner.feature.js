"use strict";

var World = require('./world');

module.exports = class Runner extends World {
  
  "When called with no arguments" () {
    return this.ui.run([]).then(execution => {
      this.execution = execution;
    });
  }
  
  "Executes all features" () {
    return this.execution.shouldHaveExecutedAllFeatures();
  }
  
  "Summarises the outcome of all scenarios" () {
    return this.execution.shouldHaveSummarisedTheOutcomeOfAllScenarios();
  }
  
  "When there are pending assertions" () {
    return this.ui.run([]).then(execution => {
      this.execution = execution;
    });
  }

  "Prints count of passing assertions" () {
    return this.execution.shouldHavePrintedTheCountOfPassingAssertions();
  }

}
