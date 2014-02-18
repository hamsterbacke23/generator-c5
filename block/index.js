'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var genUtils = require('../utils.js');
var avFields = require('./fields.js');

var BlockGenerator = module.exports = function BlockGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });
  this.argument('configFile', { type: String, required: false });

  this.configExtern = false;
  if(typeof this.configFile != 'undefined') {
    this.configExtern = JSON.parse(this.readFileAsString(this.configFile));
  }

  this.on('end', function () {
    if (this.autopkg) {
      this.invoke('c5:package', {
        args: this.pkghandle,
        options: {
          'pkgdesc' : this.blockdesc + ' Package',
          'blockhandle' : this.blockhandle,
          'dependencies' : this.dependencies,
          'nested' : true,
          'configExtern' : this.configExtern
        }
      });
    }
  });
};


util.inherits(BlockGenerator, yeoman.generators.Base);

BlockGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  if (!this.options.nested) {
    console.log(this.yeoman);
    console.log('-----------------------------------------------------');
    console.log('The block "' + this.name + '" will now  be created');
    console.log('-----------------------------------------------------');
  }

  var askTitle = typeof this.name == 'undefined' || !this.name ? true : false;

  var fieldMessage = avFields.getFieldsMessage();
  var omFieldMessage = avFields.getFieldsMessage('om');

  this.availFieldTypes = avFields.getFields()['normal'];

  var self = this;

  var prompts = [
  {
    when: function(response) {
      return askTitle;
    },
    name: 'pblockname',
    default: 'nur\'n test',
    message: 'Please enter block title:',
    validate: function(input){
      return input.length > 0;
    }
  },{
    name: 'pblockdesc',
    default: 'Mein neuer Block',
    message: 'Please enter block description:',
    validate: function(input){
      return input.length > 0;
    }
  },{
    type: 'confirm',
    name: 'pautopkg',
    message: 'Auto-create a package?',
    default: true
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
            omFieldMessage + '\r\n' +
            'Row fields: ',
    validate: function(input){
      var nameok = validateForbiddenFields(input, self);
      return input.length > 0
          && input.indexOf('|') < 0
          && nameok;
    }
  },{
    type: 'input',
    name: 'pfields',
    message: '--------------------------\r\n' +
             '>> General block fields << \r\n' +
             'Use "|" to separate Tabs \r\n' +
             fieldMessage  + ' \r\n' +
             'Fields: ',

    validate: function(input){
      var nameok = validateForbiddenFields(input, self);
      return input.length > 0 && nameok;
  }
  }];


  var validateForbiddenFields = function(input, self) {
    var forbiddenFields = avFields.getForbiddenFields();

    var fields = input.split(',');

    //loop through everything and validate
    for (var i = 0; i < fields.length; i++) {
      var fparts = fields[i].split(':');
      if(fparts.length != 2) {
        continue;
      }

      var fparts1 = fparts[0].toUpperCase();
      var fparts2 = fparts[1].toUpperCase();

      var match1 = self._.contains(forbiddenFields,fparts1 );
      var match2 = self._.contains(forbiddenFields, fparts2);

      if(match1 || match2) {
        console.log('Forbidden mysql key!');
        return false;
      }
    };

    return true;
  }

  if(this.configExtern) {
    prompts = [];
  }

  this.prompt(prompts, function (props) {
    if(this.configExtern) {
      this._.extend(props,this.configExtern);
    }
    this.pfields    = props.pfields;
    this.pomfields  = props.pomfields;
    this.om         = props.pom;
    this.ptabfields = props.ptabfields;
    this.blockdesc  = props.pblockdesc;
    this.autopkg    = props.pautopkg;
    this.name       = askTitle || this.configExtern ? props.pblockname : this.name;

    this.tabs = props.pfields.split('|').length > 1;

    this.setConfig();
    cb();
  }.bind(this));
};

BlockGenerator.prototype.setConfig = function setConfig() {
  //paths
  this.formtplpath  = '_formfields/';
  this.viewtplpath  = '_viewfields/';
  this.blocktplpath = 'blocks/_block/';

  //init vars
  this.images      = [];
  this.plainimages = [];
  this.downloads   = [];
  this.inlinks     = [];
  this.tinys       = [];
  this.checkboxes  = [];
  this.datetimes   = [];
  this.requiredFields = false;

  this.pkgversion = '0.0.1';

  //do stuff
  this.blockhandle   = this._.underscored(
    this._.slugify(this.name).trim()
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

  this.hasform         = true; //for now always create form blocks
  this.fileselector    = this.downloads.length > 0 || this.images.length > 0 || this.plainimages.length > 0;
  this.linkintern      = this.inlinks.length > 0;
  this.tiny            = this.tinys.length > 0;
  this.image           = this.images.length > 0 || this.plainimages.length > 0;
  this.responsiveimage = this.images.length > 0;
  this.plainimage      = this.plainimages.length > 0;
  this.download        = this.downloads.length > 0;
  this.datetime        = this.datetimes.length > 0;

  this.checkDependencies();

  //define handles and titles
  this.pkghandle = '';
  this.basepath = '.';
  if(this.autopkg) {
    this.pkghandle = genUtils.getHandle(this, 'sb');
    this.basepath   = 'packages/' + this.pkghandle;
  }

  console.log('-----\r\n ... bib bib bibi biiib bib ... \r\n-----');
}


BlockGenerator.prototype.checkDependencies = function checkDependencies() {
    //check dependieces
    this.dependencies = [];
    if(this.linkintern) {
      this.dependencies.push('"sb_links"');
    }
    if(this.responsiveimage) {
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

    //set required flag
    if(sfResult.required){
      this.requiredFields = true;
    }

    if(fieldParts.length > 1
      && typeof this.availFieldTypes[fieldParts[0]] != 'undefined')
    {
      sfResult.type   = fieldParts[0].trim();
      sfResult.key    = fieldParts[1].trim();
      sfResult.dbtype = this.availFieldTypes[fieldParts[0]]['dbkey'];

      sfResult = this.mapFieldTypes(sfResult);

      this.renderFieldHtml(sfResult);

      // add to main array
      result[i] = sfResult;
    }

  }

  return result;
}


BlockGenerator.prototype.mapFieldTypes = function mapFieldTypes(sfResult) {
  if(typeof sfResult == 'undefined'){
    return;
  }
  switch(sfResult.type) {
    case 'plainimage':
      sfResult.formType = 'image';
      sfResult.viewType = 'plainimage';
      break;
    default:
      sfResult.formType = sfResult.type;
      sfResult.viewType = sfResult.type;
      break;
  }
  return sfResult;
}

BlockGenerator.prototype.renderFieldHtml = function renderFieldHtml(sfResult) {
  var tplform;
  var tplview;
  var tplformOm;
  var formFileName;
  var viewFileName;
  var fileNameOm;
  var omField;

  if(typeof sfResult == 'undefined') {
    return;
  }

  sfResult.formhtml   = '';
  sfResult.omformhtml = '';
  sfResult.viewhtml   = '';

  formFileName = sfResult.formType + '.tpl.php';
  viewFileName = sfResult.viewType + '.tpl.php';

  try {
    tplform = this.read(this.formtplpath + formFileName);
  } catch(e) {
    console.log('No form template-file: ' + this.formtplpath + formFileName + ', using fallbacks if available.');
  }

  try {
    tplview = this.read(this.viewtplpath + viewFileName);
  } catch(e) {
    console.log('No view template-file: ' + this.viewtplpath + viewFileName + ', using fallbacks if available.');
  }

  if(this.om) {
    try {
      fileNameOm = 'om/' + formFileName;
      tplformOm = this.read(this.formtplpath + fileNameOm);
    } catch(e) {
      tplformOm = tplform;
      console.log('No one-to-many template file for ' + this.formtplpath + formFileName);
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
  case 'plainimage':
    this.plainimages.push(sfResult.key);
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
  case 'datetime':
    this.datetimes.push(sfResult.key);
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
  if(this.om) {
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
  this.blockpath = this.basepath + '/blocks/' + this.blockhandle + '/';
  // this.blockrelpath = 'blocks/' + this.blockhandle + '/';

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
    this.template( 'elements/editor_config.php', this.basepath + '/elements/editor_config.php');
  }
  if(this.om) {
    this.copy('libraries/Mustache.php', this.basepath + '/libraries/Mustache.php');
    this.copy('models/om_record.php', this.basepath + '/models/om_record.php');
    this.copy(this.blocktplpath + 'formstyles.inc.css', this.blockpath + 'formstyles.inc.css');
    this.template(this.blocktplpath + 'auto.js', this.blockpath + 'auto.js');
    this.template( 'elements/row.php', this.basepath + '/elements/row.php');
    this.template(this.blocktplpath + 'om_controller.php', this.blockpath + 'om_controller.php');
    this.template(this.blocktplpath + 'om_form.php', this.blockpath + 'om_form.php');
  }


};


