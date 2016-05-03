"use strict";

module.exports = class World {
  constructor() {
    this.ui = new UserInterfaceDriver();
    this.api = new ApiDriver();
  }
}

class UserInterfaceDriver {
  run() {
    return new Promise(function(fulfill) {
      var execution = {
        shouldHaveExecutedAllFeatures: function() {
          return Promise.resolve(true);
        }
      };
      fulfill(execution);
    });
  }
}

class ApiDriver {
  
}
