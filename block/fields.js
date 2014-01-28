'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

module.exports = {
  getFieldsMessage: getFieldsMessage,
  getFields:        getFields,
};


function defineFields () {

  var availFieldTypes = {};

  //availFieldTypes[{fieldkey}] = {db xml} (see http://goo.gl/o49zUR)
  var availFieldTypes = [
    {type: 'input', dbkey: 'C', om: true},
    {type: 'textarea', dbkey: 'X2', om: true},
    {type: 'checkbox', dbkey: 'I1', om: true},
    {type: 'select', dbkey: 'C', om: true},
    {type: 'image', dbkey: 'I', om: true},
    {type: 'plainimage', dbkey: 'I', om: true},
    {type: 'download', dbkey: 'I', om: true},
    {type: 'linkintern', dbkey: 'I', om: true},
    {type: 'tiny', dbkey: 'X2', om: false},
    {type: 'datetime', dbkey: 'TS', om: false}
  ];

  return availFieldTypes;
}

function getFields () {
  var fields = defineFields();
  var availFields = [];

  //define types
  availFields.om     = {};
  availFields.normal = {};
  for (var key in fields) {
    if(fields[key].om) {
      availFields.om[fields[key]['type']] = fields[key];
    }
    availFields.normal[fields[key]['type']] = fields[key];
  };

  return availFields;
}

function getFieldsMessage(mode) {
    var fieldInputMsg;
    var availFields = getFields();
    var availFieldTypes = {};

    if(typeof mode == 'undefined') {
      availFieldTypes = availFields.normal;
    } else if (mode == 'om') {
      availFieldTypes = availFields.om;
    }

    fieldInputMsg =
      '--------------------------------------------------------------------------- \r\n'
    + 'Please enter the fields you want in "type:name[__r]" format comma-separated \r\n '
    + '(Fieldtypes: ' + Object.keys(availFieldTypes).join(', ') + ')' +'\r\n'
    + '--------------------------------------------------------------------------- \r\n'
    + 'EXAMPLE: input:heading__r,tiny:text,checkbox:displayicon,linkintern:bcID' + '\r\n';

    return fieldInputMsg;
}

