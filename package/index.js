'use strict';
var util = require('util');
var path = require('path');
var genUtils = require('../utils.js');
var yeoman = require('yeoman-generator');

var PackageGenerator = module.exports = function PackageGenerator(args, options, config) {

  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });
  this.option('themehandle', { type: String, required: false, defaults: '' });

  this.on('end', function () {
    if(this.installpkg) {
      process.chdir(this.basepath);
      this.installDependencies({
        skipInstall: options['skip-install'],
        callback: function() {
          this.spawnCommand('grunt', ['install', 'cleanlines','langs']);
        }.bind(this)
      });
    }
  });
};

util.inherits(PackageGenerator, yeoman.generators.Base);

PackageGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  if (!this.options.nested) {
    console.log(this.yeoman);
    console.log('-----------------------------------------------------');
    console.log('The package "' + this.name + '" will now  be created');
    console.log('-----------------------------------------------------');
  }

  var defaultPkgDesc = typeof this.options.pkgdesc != 'undefined' ? this.options.pkgdesc : 'My Package';
  var askTitle = typeof this.name == 'undefined' || !this.name ? true : false;

  var prompts = [
    {
      when: function(response) {
        return askTitle;
      },
      name: 'ppkgname',
      default: 'pkgtest',
      message: 'Please enter package title:',
      validate: function(input){
        return input.length > 0;
      }
    },{
      name: 'pdesc',
      message: 'Package description: ',
      default: defaultPkgDesc,
      validate: function(input){
        return input.length > 0;
      }
    },{
      name: 'pkgcli',
      type: 'confirm',
      message: 'Include command line interface?',
      default: true
    },{
      when: function(response) {
        return response.pkgcli == true;
      },
      name: 'pkginstall',
      type: 'confirm',
      message: 'Install Grunt Tasks and try installing the package in concrete5?',
      default: true
    }];

  this.prompt(prompts, function (props) {
    this.pkgdesc      = props.pdesc;
    this.installpkg   = props.pkginstall;
    this.cblock       = props.cblock;
    this.pkgversion   = '0.0.1';
    this.blockhandle  = typeof this.options.blockhandle == 'undefined' ? '' : this.options.blockhandle;
    this.dependencies = typeof this.options.dependencies == 'undefined' ? '' : this.options.dependencies;
    this.name         = askTitle ? props.ppkgname : this.name;
    this.themehandle  = this.options.themehandle;

    //define handles and titles
    this.pkghandle   = genUtils.getHandle(this);
    this.basepath     = 'packages/' + this.pkghandle + '/';
    this.pkgcchandle = this._.classify(this.pkghandle).trim();

    cb();
  }.bind(this));

  this.pkgtplpath   = '';
};


PackageGenerator.prototype.projectfiles = function projectfiles() {
  this.template(this.pkgtplpath + '_controller.php', this.basepath + 'controller.php');
  this.copy(this.pkgtplpath + '_cli/_install_cli.php', this.basepath + 'cli/install_cli.php');
  this.copy(this.pkgtplpath + '_cli/_uninstall_cli.php', this.basepath + 'cli/uninstall_cli.php');
  this.copy(this.pkgtplpath + '_cli/_upgrade_cli.php', this.basepath + 'cli/upgrade_cli.php');
  this.copy(this.pkgtplpath + '_index_cli.php', this.basepath + 'index_cli.php');
  this.copy(this.pkgtplpath + 'icon.png', this.basepath + 'icon.png');
  this.directory(this.pkgtplpath + 'languages', this.basepath + 'languages');
  this.template(this.pkgtplpath +'_Gruntfile.js', this.basepath + 'Gruntfile.js');
  this.template(this.pkgtplpath + '_package.json', this.basepath + 'package.json');
  this.template(this.pkgtplpath + '_readme.md', this.basepath + 'readme.md');
};

