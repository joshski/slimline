"use strict";

var World = require('./world');

module.exports = class Runner extends World {

  "When features are executed" () {
    return this.fileSystem.createFiles({
      features: {
        'fruit.feature': [
          "Fruit",
          "",
          "Bananas",
          "* Are tasty",
          "* Are yellow"
        ].join("\n"),
        'veg.feature': [
          "Veg",
          "",
          "Carrots",
          "* Are orange"
        ].join("\n")
      }
    }).then(() => this.ui.run([]).then(result => {
      this.result = result;
    }));
  }
  
  "When called with no arguments" () {
    return this.ui.run([]).then(execution => {
      this.execution = execution;
    });
  }
  
  "Prints count of features, scenarios and assertions" () {
    return this.result.shouldHaveSummarisedCounts();
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
