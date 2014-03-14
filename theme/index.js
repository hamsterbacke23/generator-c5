"use strict";
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var genUtils = require('../utils.js');

var ThemeGenerator = module.exports = function ThemeGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });


  this.on('end', function () {
    if (this.autopkg) {
      this.invoke('c5:package', {
        args: this.pkghandle,
        options: {
          'pkgdesc' : this.themedesc + ' Package',
          'themehandle' : this.themehandle,
          'nested' : true
        }
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
    name: 'ppagetypes',
    message: 'Page Types: e.g. Zwei Spalten, Left Sidebar, Drei Spalten ...\r\n' +
             'Page Types: ',
    validate: function(input){
      return input.length > 0;
    }
  },{
    type: 'confirm',
    name: 'responsiveImages',
    message: 'Use responsive images?',
    default: true
  },{
    type: 'confirm',
    name: 'multilanguage',
    message: 'Use multiple languages?',
    default: true
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
    this.prepros          = props.prepros;
    this.multilanguage    = props.multilanguage;
    this.responsiveImages = props.responsiveImages;
    this.dependencies     = '';

    var pageTypes = props.ppagetypes.split(',');
    this.pageTypes = [];
    for (var i = 0; i < pageTypes.length; i++) {
      var pageType = {
        key : this._.underscored(pageTypes[i]),
        value : pageTypes[i].trim()
      };
      this.pageTypes[i] = pageType;
    };


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
  var self = this;
  this.themepath = this.themehandle + '/';

  //Multilangue stuff
  if(this.multilanguage) {
    this.copy('blocks/switch_language/templates/_theme.php', this.basepath + 'blocks/switch_language/templates/' + this.themehandle + '.php');
    prdirs('languages/', this.basepath + 'languages/');
  }

  //Helpers
  prdirs('helpers', this.basepath + 'helpers');

  //Navigation
  this.copy('blocks/autonav/templates/_theme.php', this.basepath + 'blocks/autonav/templates/' + this.themehandle + '.php');

  prdirs('themes/_theme', this.basepath + 'themes/' + this.themehandle);
  //Theme

  //Page Types
  this._.each(this.pageTypes, function(pageType) {
    self.copy('themes/_theme/_pagetype.php', self.basepath + 'themes/' + self.themehandle + '/' + pageType.key + '.php');
  });

  // Elements (header_required etc.)
  prdirs('elements', this.basepath + 'elements');

  //Make new Sass or Less dir
  this.mkdir(this.basepath  + 'themes/' + this.themepath + 'css/' + this.prepros);
};


