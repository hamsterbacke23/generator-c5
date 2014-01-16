'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var avFields = require('./fields.js');

var BlockGenerator = module.exports = function BlockGenerator(args, options, config) {
  var self = this;
  yeoman.generators.NamedBase.apply(this, arguments);
  this.argument('blockhandle', { type: String, required: true });
};


util.inherits(BlockGenerator, yeoman.generators.NamedBase);

BlockGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);
  console.log(
  '--------------------------------\r\n'+
  '  SB concrete5 block generator\r\n'+
  '--------------------------------'
  );

  this.availFieldTypes = avFields.getFields();

  var fieldInputMsg =
      '--------------------------------------------------------------------------- \r\n'
    + 'Please enter the fields you want in "type:name[__r]" format comma-separated \r\n '
    + '(Fieldtypes: ' + Object.keys(this.availFieldTypes).join(', ') + '\r\n'
    + '--------------------------------------------------------------------------- \r\n'
    + 'EXAMPLE: input:heading__r,tiny:text,checkbox:displayicon,linkintern:bcID' + '\r\n';

  var prompts = [{
      type: 'message',
      name: 'pblockdesc',
      default: this.pkghandle + 'Package ' + this.blockhandle + ' Block',
      message: 'Please enter block description with format "title:description": \r\n'
              + 'Block: ',
      validate: function(input){
        return input.length > 0;
      }
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
    message: '--------------------------\r\n' +
            '>> Fields for one row << \r\n' +
            fieldInputMsg + '\r\n' +
            'Row fields: ',
    validate: function(input){
      return input.length > 0 && input.indexOf('|') < 0;
    }
  },{
    type: 'input',
    name: 'pfields',
    message: '--------------------------\r\n' +
             '>> General block fields << \r\n' +
             'Use "|" to separate Tabs \r\n' +
             fieldInputMsg  + ' \r\n' +
             'Fields: ',

    validate: function(input){
      return input.length > 0;
  }
  }];

  this.prompt(prompts, function (props) {
    this.pfields    = props.pfields;
    this.pomfields  = props.pomfields;
    this.pom        = props.pom;
    this.ptabfields = props.ptabfields;
    this.blockdesc  = props.pblockdesc;

    this.tabs = props.pfields.split('|').length > 1;

    this.images     = [];
    this.downloads  = [];
    this.inlinks    = [];
    this.tinys      = [];
    this.checkboxes = [];

    this.om = props.pom;

    this.pkgversion = '0.0.1';
    this.namespace  = 'sb';

    //define handles and titles
    this.pkgpath       = this.pkghandle + '/';

    this.blockhandle   = this._.underscored(
      this._.slugify(this.blockhandle).trim()
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

  this.formtplpath = '_formfields/';
  this.viewtplpath  = '_viewfields/';
  this.blocktplpath = 'blocks/_block/';
};



BlockGenerator.prototype.checkDependencies = function checkDependencies() {
    //check dependieces
    this.dependencies = [];
    if(this.linkintern   == true) {
      this.dependencies.push('"sb_links"');
    }
    if(this.image == true) {
      this.dependencies.push('"sb_images"');
    }
    this.dependencies = this.dependencies.join(',');
};

BlockGenerator.prototype.buildTpl = function buildTpl(fields) {
  var formtpl;
  if(typeof fields == 'undefined'){
    return;
  }

  formtpl = this.read(this.blocktplpath + 'form.php');
  for (var i = 0; i < fields.length; i++) {
    if(typeof fields[i] != 'undefined' && typeof fields[i].formhtml != 'undefined') {
      formtpl += fields[i].formhtml;
    } else {
      console.log('Error: HTML not found...');
    }
  };
  return formtpl;
};


BlockGenerator.prototype.processSingleFields = function processSingleFields(str) {
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

BlockGenerator.prototype.renderFieldHtml = function renderFieldHtml(sfResult) {
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

BlockGenerator.prototype.checkType = function checkType(sfResult) {
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


BlockGenerator.prototype.processFields = function processFields() {
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
      result.fields = this._.flatten(resultTabs);
    }
  }
  if(this.pom) {
    result.omfields = this.processSingleFields(this.pomfields);
  }
  if(this.pfields.length > 0 && !this.tabs) {
    result.fields = this.processSingleFields(this.pfields);
  }
  // console.log(result);
  return result;
};

BlockGenerator.prototype.files = function files() {
  //define paths
  this.blockpath = this.pkgpath + 'blocks/' + this.blockhandle + '/';
  this.blockrelpath = 'blocks/' + this.blockhandle + '/';

  //do basic files
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
    this.template( 'elements/editor_config.php', this.pkgpath + '/elements/editor_config.php');
  }
  if(this.om) {
    this.copy('libraries/Mustache.php', this.pkgpath + '/libraries/Mustache.php');
    this.copy('models/om_record.php', this.pkgpath + '/models/om_record.php');
    this.copy(this.blocktplpath + 'formstyles.inc.css', this.blockpath + 'formstyles.inc.css');
    this.template(this.blocktplpath + 'auto.js', this.blockpath + 'auto.js');
    this.template( 'elements/row.php', this.pkgpath + '/elements/row.php');
    this.template(this.blocktplpath + 'om_controller.php', this.blockpath + 'om_controller.php');
    this.template(this.blocktplpath + 'om_form.php', this.blockpath + 'om_form.php');
  }

  this.copy('_index_cli.php', 'index_cli.php');
  this.copy('icon.png', this.pkgpath + 'icon.png');
  this.template('_cli/_upgrade_cli.php', this.pkgpath + 'cli/upgrade_cli.php');
  this.template('_cli/_install_cli.php', this.pkgpath + 'cli/install_cli.php');
  this.template('_Gruntfile.js', this.pkgpath + 'Gruntfile.js');
  this.template( '_package.json', this.pkgpath + 'package.json');
};


