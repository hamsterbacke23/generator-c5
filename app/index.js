'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var C5Generator = module.exports = function C5Generator(args, options, config) {

  yeoman.generators.Base.apply(this, arguments);
  this.argument('name', { type: String, required: false });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    // have Yeoman greet the user.
  console.log(this.yeoman);

  this.hookFor('c5:block', {
    args: args,
    options: {
      options : {
        'nested' : true
      }
    }
  });

};

util.inherits(C5Generator, yeoman.generators.Base);

