'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var C5blockGenerator = module.exports = function C5blockGenerator(args, options, config) {

  yeoman.generators.Base.apply(this, arguments);
  this.argument('name', { type: String, required: true });

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(C5blockGenerator, yeoman.generators.Base);

C5blockGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);
  console.log(
  '--------------------------------\r\n'+
  '  SB concrete5 package generator\r\n'+
  '--------------------------------'
  );

  var prompts = [{
      type: 'message',
      name: 'pdesc',
      message: 'Package description": ',
      validate: function(input){
        return input.length > 0;
      }
    },{
      type: 'confirm',
      name: 'cblock',
      message: 'Create Block ?',
      default: true
  }];

  this.prompt(prompts, function (props) {
    this.pkgdesc    = props.pdesc;
    this.cblock     = props.cblock;
    this.pkgversion = '0.0.1';
    this.namespace  = 'sb';

    //define handles and titles
    this.pkghandle     = this._.underscored(
      this.namespace + '_' + this._.slugify(this.namespace + '_' + this.name.toLowerCase()).trim()
    );
    this.pkgpath       = this.pkghandle + '/';
    this.pkgcchandle   = this._.classify(this.namespace + '_' + this.name).trim();

    cb();
  }.bind(this));

  this.pkgtplpath   = '';
};


C5blockGenerator.prototype.app = function app() {
  if (this.cblock) {
    this.invoke("c5block:block", {arguments: this.pkghandle + ' ' + this.name});
  }
}

C5blockGenerator.prototype.projectfiles = function projectfiles() {
  this.template(this.pkgtplpath + '_controller.php', this.pkgpath + 'controller.php');
  this.copy('_index_cli.php', 'index_cli.php');
  this.copy(this.pkgtplpath + 'icon.png', this.pkgpath + 'icon.png');
  this.template(this.pkgtplpath +'_Gruntfile.js', this.pkgpath + 'Gruntfile.js');
  this.template(this.pkgtplpath + '_package.json', this.pkgpath + 'package.json');
};

