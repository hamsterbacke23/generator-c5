'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var avFields = require('./fields.js');


var C5blockGenerator = module.exports = function C5blockGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

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
  '  SB concrete5 block generator\r\n'+
  '--------------------------------'
  );

  this.availFieldTypes = avFields.getFields();

  var fieldInputMsg = 'Please enter the fields you want in "type:name[__r]" format comma-separated \r\n '
    + '(Fieldtypes: ' + Object.keys(this.availFieldTypes).join(', ') + '\r\n'
    + 'EXAMPLE: input:heading__r,tiny:text,checkbox:displayicon,linkintern:bcID' + '\r\n'
    + 'Fields: ';

  var prompts = [{
      type: 'message',
      name: 'ptitles',
      message: 'Please enter block title and description with format "title:description":',
      validate: function(input){
        return input.length > 0 && input.indexOf(':') != -1;
      }
  },{
    type: 'input',
    name: 'pversion',
    default: '0.0.1',
    message: 'Package Version'
  },{
    type: 'confirm',
    name: 'pom',
    message: 'Does this block use multiple rows (e.g. Slider slides)?',
    default: false
  },{
    when: function (response) {
      return response.pom;
    },
    type: 'input',
    name: 'pomfields',
    message: 'Fields for one row: \r\n' + fieldInputMsg,
    validate: function(input){
      return input.length > 0;
    }
  },{
    type: 'input',
    name: 'pfields',
    message: 'General block fields: \r\n' + fieldInputMsg,
    validate: function(input){
      return input.length > 0;
  }
  }];

  this.prompt(prompts, function (props) {
    this.pfields    = props.pfields;
    this.pomfields  = props.pomfields;
    this.pom        = props.pom;
    this.ptabfields = props.ptabfields;
    this.pkgversion = props.pversion;

    this.tabs = props.pfields.split('|').length > 0;

    this.images     = [];
    this.downloads  = [];
    this.inlinks    = [];
    this.tinys      = [];
    this.checkboxes = [];

    this.om = props.pom;

    //define handles and titles
    var titles = props.ptitles.split(':');

    this.pkghandle     = this._.underscored(
      'sb_' + this._.slugify(titles[0].toLowerCase()).trim()
    );
    this.pkgpath       = this.pkghandle + '/';
    this.pkgcchandle   = this._.classify('Sb_' + titles[0]).trim();
    this.pkgdesc       = titles[1] + ' Package';
    this.blockdesc     = titles[1];
    this.blockhandle   = this._.underscored(
      this._.slugify(titles[0]).trim()
    );
    this.blockcchandle = this._.classify(this.blockhandle).trim();

    //read fields
    this.allFields = this.processFields(); //bug: why is processfields called twice?
    this.fields = this.allFields.fields;
    this.fieldstpl = this.buildTpl(this.fields);

    if(this.om) {
      this.omfields = this.allFields.omfields;
      this.omfieldstpl = this.buildTpl(this.omfields)
    }
    if(this.tabs) {
      this.tabfields = this.allFields.tabfields;
    }

    this.hasform      = true; //for now always create form blocks
    this.fileselector = this.downloads.length > 0 || this.images.length > 0;
    this.linkintern   = this.inlinks.length > 0;
    this.tiny         = this.tinys.length > 0;
    this.image        = this.images.length > 0;
    this.download     = this.downloads.length > 0;

    this.checkDependencies();

    console.log('-----\r\n ... bib bib bibi biiib bib ... \r\n-----');
    cb();
  }.bind(this));

  this.pkgtplpath   = 'pkg_tpl/';
  this.formtplpath = 'formfields_tpl/';
  this.viewtplpath  = 'viewfields_tpl/';
  this.blocktplpath = 'pkg_tpl/blocks/block_tpl/';
};


C5blockGenerator.prototype.checkDependencies = function checkDependencies() {
    //check dependieces
    this.dependencies = [];
    if(this.linkintern   == true) {
      this.dependencies.push('"sb_links"');
    }
    if(this.image == true) {
      this.dependencies.push('"sb_images"');
    }
    if(this.tiny == true) {
      this.dependencies.push('"sb_texteditor"');
    }
    this.dependencies = this.dependencies.join(',');
};

C5blockGenerator.prototype.buildTpl = function buildTpl(fields) {
  var formtpl;
  if(typeof fields == 'undefined'){
    return;
  }

  formtpl = this.read(this.blocktplpath + 'form.php');
  for (var i = 0; i < fields.length; i++) {
    if(typeof fields[i].formhtml != 'undefined') {
      formtpl += fields[i].formhtml;
    } else {
      console.log('Error: HTML not found: ' + fields[i].key);
    }
  };
  return formtpl;
};


C5blockGenerator.prototype.processSingleFields = function processSingleFields(str) {
  var result = [];
  if(typeof str == 'undefined'){
    return result;
  }
  var singleFields = str.split(',');
  var sf;
  var sfResult;
  var fieldParts;
  var reqParts;


  if(singleFields.length == 0){
    return result;
  }

  for (var i = 0; i < singleFields.length; i++) {
    sf = singleFields[i];
    sfResult = {};
    fieldParts;

    reqParts = sf.split('__');
    sfResult.required = reqParts.length > 0 && reqParts[1] == 'r';
    fieldParts = sfResult.required ? reqParts[0].split(':') : sf.split(':');

    if(fieldParts.length > 1
      && typeof this.availFieldTypes[fieldParts[0]] != 'undefined')
    {
      sfResult.type   = fieldParts[0].trim();
      sfResult.key    = fieldParts[1].trim();
      sfResult.dbtype = this.availFieldTypes[fieldParts[0]];

      this.renderFieldHtml(sfResult);

      // add to main array
      result[i] = sfResult;
    }

  }

  return result;
}

C5blockGenerator.prototype.renderFieldHtml = function renderFieldHtml(sfResult) {
  var tplform;
  var tplview;
  var tplformOm;
  var fileName;
  var fileNameOm;
  var omField;

  if(typeof sfResult == 'undefined') {
    return;
  }

  sfResult.formhtml   = '';
  sfResult.omformhtml = '';
  sfResult.viewhtml   = '';

  fileName = sfResult.type + '.tpl.php';

  try {
    tplform = this.read(this.formtplpath + fileName);
  } catch(e) {
    console.log('No form template-file: ' + this.formtplpath + fileName + ', using fallbacks if available.');
  }

  try {
    tplview = this.read(this.viewtplpath + fileName);
  } catch(e) {
    console.log('No view template-file: ' + this.viewtplpath + fileName + ', using fallbacks if available.');
  }

  if(this.om == true) {
    try {
      fileNameOm = 'om/' + fileName;
      tplformOm = this.read(this.formtplpath + fileNameOm);
    } catch(e) {
      tplformOm = tplform;
      console.log('No one-to-many template file for ' + this.formtplpath + fileName);
    }

    omField = this._.clone(sfResult);
    sfResult.omformhtml = this._.template(tplformOm, {
      field: omField,
      blockhandle : this.blockhandle
    });

  }

  if(typeof tplform != 'undefined') {
    sfResult.formhtml = this._.template(tplform,{
      field: sfResult,
      blockhandle : this.blockhandle
    });
  }

  if(typeof tplview != 'undefined') {
    sfResult.viewhtml = this._.template(tplview,{
      field: sfResult,
      blockhandle : this.blockhandle
    });
  }

  sfResult.omformhtml = sfResult.omformhtml != '' ? sfResult.omformhtml : sfResult.formhtml;

  this.checkType(sfResult);
  return sfResult;
}

C5blockGenerator.prototype.checkType = function checkType(sfResult) {
  if(typeof sfResult == 'undefined') {
    return;
  }
  // field type specific general settings
  switch(sfResult.type)
  {
  case 'image':
    this.images.push(sfResult.key);
    break;
  case 'download':
    this.downloads.push(sfResult.key);
    break;
  case 'linkintern':
    this.inlinks.push(sfResult.key);
    break;
  case 'tiny':
    this.tinys.push(sfResult.key);
    break;
  case 'checkbox':
    this.checkboxes.push(sfResult.key);
    break;
  }

}


C5blockGenerator.prototype.processFields = function processFields() {
  var singleFields;
  var result = {};
  if(this.tabs) {
    var tabs = this.pfields.split('|');
    var resultTabs = [];
    for (var i = 0; i < tabs.length; i++) {
      resultTabs[i] = this.processSingleFields(tabs[i]);
    };
    if(resultTabs.length > 0 ){
      result.tabfields = resultTabs;
    }
  }
  if(this.pom) {
    result.omfields = this.processSingleFields(this.pomfields);
  }
  if(this.pfields.length > 0) {
    result.fields = this.processSingleFields(this.pfields);
  }
  // console.log(result);
  return result;
};

C5blockGenerator.prototype.app = function app() {
  //define paths
  this.blockpath = this.pkgpath + 'blocks/' + this.blockhandle + '/';
  this.blockrelpath = 'blocks/' + this.blockhandle + '/';

  //do basic files
  this.template(this.pkgtplpath + 'controller.php', this.pkgpath + 'controller.php');
  this.template(this.blocktplpath + 'view.php', this.blockpath + 'view.php');
  this.template(this.blocktplpath + 'controller.php', this.blockpath + 'controller.php');

  //add form files
  if(this.hasform) {
    this.template(this.blocktplpath + 'form.php', this.blockpath + 'form.php');
    this.template(this.blocktplpath + 'db.xml', this.blockpath + 'db.xml');
    this.template(this.blocktplpath + 'edit.php', this.blockpath + 'edit.php');
    this.template(this.blocktplpath + 'add.php', this.blockpath + 'add.php');
  }
  if(this.tiny) {
    this.template(this.blocktplpath + 'tiny_controller.php', this.blockpath + 'tiny_controller.php');
  }
  if(this.om) {
    this.copy(this.pkgtplpath + '/libraries/Mustache.php', this.pkgpath + '/libraries/Mustache.php');
    this.copy(this.pkgtplpath + '/models/om_record.php', this.pkgpath + '/models/om_record.php');
    this.copy(this.blocktplpath + 'formstyles.inc.css', this.blockpath + 'formstyles.inc.css');
    this.template(this.blocktplpath + 'auto.js', this.blockpath + 'auto.js');
    this.template(this.pkgtplpath + '/elements/row.php', this.pkgpath + '/elements/row.php');
    this.template(this.blocktplpath + 'om_controller.php', this.blockpath + 'om_controller.php');
    this.template(this.blocktplpath + 'om_form.php', this.blockpath + 'om_form.php');
  }
  // this.copy('_package.json', 'package.json'); //for dependencies like grunt etc
};


C5blockGenerator.prototype.projectfiles = function projectfiles() {
  // var pkgpath = this.pkghandle + '/';
  this.template('Gruntfile.js', this.pkgpath + 'Gruntfile.js');
  this.template('_package.json', this.pkgpath + 'package.json');
};

