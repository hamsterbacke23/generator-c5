'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var genUtils = require('../utils.js');

var ThemeGenerator = module.exports = function ThemeGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });

  var runGruntTask = function() {
    process.chdir(this.basepath + 'themes/' + this.themehandle);
    this.spawnCommand('grunt', ['assets']);
    if(this.prepros != 'none'){
      this.spawnCommand('grunt', ['watch']);
    }
  };

  var installPkg = function() {
    if (this.autopkg) {
      process.chdir(this.curdir);
      this.invoke('c5:package', {
        args: this.pkghandle,
        options: {
          'pkgdesc' : this.themedesc + ' Package',
          'themehandle' : this.themehandle,
          'dependencies' : this.dependencies,
          'nested' : true
        },
        callback: runGruntTask.bind(this)
      });
    }
  };


  this.on('end', function () {
    if(this.donpm) {
      process.chdir(this.basepath + 'themes/' + this.themehandle);
      this.installDependencies({
        skipInstall: options['skip-install'],
        callback: installPkg.bind(this)
      });
    }
  });


};


util.inherits(ThemeGenerator, yeoman.generators.Base);

ThemeGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  if (!this.options.nested) {
    console.log(this.yeoman);
    console.log('-----------------------------------------------------');
    console.log('The theme "' + this.name + '" will now  be created');
    console.log('-----------------------------------------------------');
  }

  var askTitle = typeof this.name == 'undefined' || !this.name ? true : false;
  this.curdir = process.cwd();

  var prompts = [
  {
    when: function(response) {
      return askTitle;
    },
    name: 'pthemename',
    default: 'theme',
    message: 'Please enter theme name:',
    validate: function(input){
      return input.length > 0;
    }
  },{
    name: 'pthemedesc',
    default: 'Mein neues theme',
    message: 'Please enter theme description:',
    validate: function(input){
      return input.length > 0;
    }
  },{
    type: 'confirm',
    name: 'responsiveImages',
    message: 'Use sb responsive images?',
    default: true
  },{
    type: 'confirm',
    name: 'donpm',
    message: 'Install npm dependencies?',
    default: true
  },{
    when: function(response) {
      return response.donpm == true;
    },
    type: 'list',
    name: 'prepros',
    message: 'Preprocessor?',
    choices : [
      {name:'Sass', value: 'sass'},
      {name: 'Less', value : 'less'},
      {name: 'None', value : 'none'}],
    default: 'sass'
  },{
    type: 'confirm',
    name: 'pautopkg',
    message: 'Auto-create a Package?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.themedesc        = props.pthemedesc;
    this.autopkg          = props.pautopkg;
    this.name             = askTitle ? props.pthemename : this.name;
    this.donpm            = props.donpm;
    this.prepros          = props.prepros;
    this.responsiveImages = props.responsiveImages;
    this.dependencies     = '';

    this.themehandle   = this._.underscored(
      this._.slugify(this.name).trim()
    );

    //define handles and titles
    this.pkghandle = '';
    this.basepath = '';
    if(props.pautopkg) {
      this.pkghandle = genUtils.getHandle(this, 'sb');
      this.basepath   = 'packages/' + this.pkghandle + '/';
    }

    cb();
  }.bind(this));

};

ThemeGenerator.prototype.files = function files() {
  var prdirs = genUtils.processDirectory.bind(this);
  this.themepath = this.themehandle + '/';
  prdirs('themes/_theme', this.basepath + 'themes/' + this.themehandle);
  prdirs('elements', this.basepath + 'elements');
  this.mkdir(this.basepath  + 'themes/' + this.themepath + 'css/' + this.prepros);
};


