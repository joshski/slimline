"use strict";

module.exports = class RunnerFeature {
  
  "When running the executable with no arguments" () {
    return this.ui.runExecutable([]).then(execution => {
      this.execution = execution;
    });
  }
  
  "Executes all feature files" () {
    return this.execution.shouldHaveExecutedAllFeatureFiles();
  }
  
  "Summarises the outcome of all scenarios" () {
    return this.execution.shouldHaveSummarisedTheOutcomeOfAllScenarios();
  }

}
