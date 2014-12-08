'use strict';
var util = require('util');
var path = require('path');
var genUtils = require('../utils.js');
var yeoman = require('yeoman-generator');

var PackageGenerator = module.exports = function PackageGenerator(args, options, config) {

  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });

  this.option('themehandle', { type: String, required: false, defaults: '' });
  this.option('configExtern', { type: Object, required: false});

  this.on('end', function () {
    if(this.pkgbuild) {
      process.chdir(this.basepath);
      this.installDependencies({
        skipInstall: options['skip-install'],
        callback: function() {
          var cmds = ['cleanlines', 'langs'];
          if(this.installpkg) {
            cmds.push('exec:install');
          }
          this.spawnCommand('grunt', cmds);
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
      name: 'pkgdesc',
      message: 'Package description: ',
      default: defaultPkgDesc,
      validate: function(input){
        return input.length > 0;
      }
    },{
      name: 'pkgbuild',
      type: 'confirm',
      message: 'Use Grunt?',
      default: true
    },{
      when: function(response) {
        return response.pkgbuild === true;
      },
      name: 'pkgcli',
      type: 'confirm',
      message: 'Include command line?',
      default: true
    },{
      when: function(response) {
        return response.pkgcli === true;
      },
      name: 'pkginstall',
      type: 'confirm',
      message: 'Try installing the package in concrete5?',
      default: false
    }];

    if(this.options.configExtern) {
      prompts = [];
    }

    this.prompt(prompts, function (props) {
      if(this.options.configExtern) {
        this._.extend(props, this.options.configExtern);
      }
      this.pkgdesc    = props.pkgdesc.trim();
      this.pkgauthor  = props.pauthor.trim();
      this.installpkg = props.pkginstall;
      this.pkgcli     = props.pkgcli;
      this.pkgbuild   = typeof props.pkgbuild == undefined ? true : props.pkgbuild;
      this.pkgversion = typeof props.pkgversion == undefined || !props.pkgversion ? '0.0.1' : props.pkgversion;
      this.name       = askTitle ? props.ppkgname : this.name;
      this.setConfig();
      cb();
    }.bind(this));

};


PackageGenerator.prototype.setConfig = function setConfig() {
  this.pkgtplpath   = '';
  this.blockhandle  = typeof this.options.blockhandle == 'undefined' ? '' : this.options.blockhandle;
  this.dependencies = typeof this.options.dependencies == 'undefined' ? '' : this.options.dependencies;
  this.themehandle  = this.options.themehandle;

  //define handles and titles
  this.pkghandle   = genUtils.getHandle(this);
  this.basepath     = 'packages/' + this.pkghandle + '/';
  this.pkgcchandle = this._.classify(this.pkghandle).trim();
};


PackageGenerator.prototype.projectfiles = function projectfiles() {
  this.template(this.pkgtplpath + '_controller.php', this.basepath + 'controller.php');

  if(this.pkgcli) {
    this.copy(this.pkgtplpath + '_cli/_install_cli.php', this.basepath + 'cli/install_cli.php');
    this.copy(this.pkgtplpath + '_cli/_uninstall_cli.php', this.basepath + 'cli/uninstall_cli.php');
    this.copy(this.pkgtplpath + '_cli/_upgrade_cli.php', this.basepath + 'cli/upgrade_cli.php');
    this.copy(this.pkgtplpath + '_cli/_init.php', this.basepath + 'cli/init.php');
  }

  if(this.pkgbuild) {
    this.template(this.pkgtplpath + '_composer.json', this.basepath + 'composer.json');
    this.template(this.pkgtplpath + '_readme.md', this.basepath + 'readme.md');
    this.template(this.pkgtplpath + '_package.json', this.basepath + 'package.json');

    if(this.themehandle) {
      this.template(this.pkgtplpath +'_GruntfileTheme.js', this.basepath + 'Gruntfile.js');
    } else {
      this.template(this.pkgtplpath +'_Gruntfile.js', this.basepath + 'Gruntfile.js');
    }
  }

  this.copy(this.pkgtplpath + 'icon.png', this.basepath + 'icon.png');
  this.directory(this.pkgtplpath + '_languages', this.basepath + 'languages');

  // this.config.save();
};

