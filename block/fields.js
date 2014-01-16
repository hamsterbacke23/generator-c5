'use strict';
var path = require('path');
// var fs = require('fs');

module.exports = {
  getFields: getFields
};


function getFields () {

  var availFieldTypes = {};

  //availFieldTypes[{fieldkey}] = {db xml} (see http://goo.gl/o49zUR)
  availFieldTypes['input']      = 'C';
  availFieldTypes['tiny']       = 'X2';
  availFieldTypes['textarea']   = 'X2';
  availFieldTypes['checkbox']   = 'I1';
  availFieldTypes['select']     = 'C';
  availFieldTypes['image']      = 'I';
  availFieldTypes['download']   = 'I';
  availFieldTypes['linkintern'] = 'I';

  return availFieldTypes;
}

