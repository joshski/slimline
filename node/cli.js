var slimline = require('../');

function cli(args) {

  slimline({
    root: process.cwd(),
    args: args,
    walk: require('./walk'),
    read: require('./read'),
    report: require('./report')
  }).run();

}

module.exports = cli;
