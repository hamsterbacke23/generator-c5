"use strict";
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var genUtils = require('../utils.js');

var ThemeGenerator = module.exports = function ThemeGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });
  this.argument('configFile', { type: String, required: false });

  this.configExtern = false;
  if(typeof this.configFile != 'undefined') {
    this.configExtern = JSON.parse(this.readFileAsString(this.configFile));
  }

  this.on('end', function () {
    if (this.autopkg) {
      var forceArg = this.configExtern ? ' --force' : '';
      this.invoke('c5:package', {
        args: this.pkghandle + forceArg,
        options: {
          'pkgdesc' : this.themedesc + ' Package',
          'themehandle' : this.themehandle,
          'nested' : true,
          'configExtern' : this.configExtern
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

  if(this.configExtern) {
    prompts = [];
  }

  this.prompt(prompts, function (props) {
    if(this.configExtern) {
      this._.extend(props, this.configExtern);
    }
    this.themedesc        = props.pthemedesc;
    this.autopkg          = props.pautopkg;
    this.name             = askTitle || this.configExtern ? props.pthemename : this.name;
    this.prepros          = props.prepros;
    this.multilanguage    = props.multilanguage;
    this.responsiveImages = props.responsiveImages;
    this.dependencies     = '';



    if(!this.configExtern){
      var pageTypes = props.ppagetypes.split(',');
      this.pageTypes = [];
      for (var i = 0; i < pageTypes.length; i++) {
        var pageType = {
          key : this._.underscored(pageTypes[i]),
          value : pageTypes[i].trim()
        };
        this.pageTypes[i] = pageType;
      };
    } else {
      this.pageTypes = this.configExtern.pageTypes;
    }

    this.themehandle   = this._.underscored(
      this._.slugify(this.name).trim()
    );

    //define handles and titles
    this.pkghandle = '';
    this.basepath = '.';
    if(this.autopkg) {
      this.pkghandle = genUtils.getHandle(this, 'sb');
      this.basepath   = 'packages/' + this.pkghandle;
    }

    cb();
  }.bind(this));
};


ThemeGenerator.prototype.exportJson = function exportJson() {

  var exportProps = {};
  var str, file;

  exportProps.pageTypes  = this.pageTypes;
  exportProps.pthemename = this.name;
  exportProps.pthemedesc = this.themedesc;
  exportProps.pautopkg   = true;
  exportProps.pkginstall = false;
  exportProps.pkgcli     = false;
  exportProps.pkgdesc    = this.name + " Package";

  str =  JSON.stringify(exportProps);
  file = this.basepath + '/generator-c5theme.json';

  this.write(file,str);

}


ThemeGenerator.prototype.files = function files() {
  var prdirs = genUtils.processDirectory.bind(this);
  var self = this;
  this.themepath = this.themehandle + '/';

  //Multilangue stuff
  if(this.multilanguage) {
    this.copy('blocks/switch_language/templates/_theme.php', this.basepath + '/blocks/switch_language/templates/' + this.themehandle + '.php');
    prdirs('languages/', this.basepath + '/languages/');
  }

  //Helpers
  prdirs('helpers', this.basepath + '/helpers');

  //Navigation
  this.copy('blocks/autonav/templates/_theme.php', this.basepath + '/blocks/autonav/templates/' + this.themehandle + '.php');

  //Theme
  prdirs('themes/_theme/inc', this.basepath + '/themes/' + this.themehandle + '/inc');
  prdirs('themes/_theme/js', this.basepath + '/themes/' + this.themehandle + '/js');
  prdirs('themes/_theme/css', this.basepath + '/themes/' + this.themehandle + '/css');
  this.template('themes/_theme/_description.txt', this.basepath + '/themes/' + this.themehandle + '/description.txt');
  this.copy('themes/_theme/default.php', this.basepath + '/themes/' + this.themehandle + '/default.php');
  this.copy('themes/_theme/thumbnail.png', this.basepath + '/themes/' + this.themehandle + '/thumbnail.png');
  this.copy('themes/_theme/view.php', this.basepath + '/themes/' + this.themehandle + '/view.php');


  //Page Types
  this._.each(this.pageTypes, function(pageType) {
    self.copy('themes/_theme/_pagetype.php', self.basepath + '/themes/' + self.themehandle + '/' + pageType.key + '.php');
  });

  // Elements (header_required etc.)
  prdirs('elements', this.basepath + '/elements');

  //export
  this.exportJson();

};


