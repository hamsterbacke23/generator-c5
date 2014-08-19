'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

module.exports = {
  getFieldsMessage: getFieldsMessage,
  getFields:        getFields,
  getForbiddenFields: getForbiddenFields
};


function defineFields () {

  var availFieldTypes = [
            {type: 'input', dbkey: 'C', om: true},
            {type: 'textarea', dbkey: 'X2', om: true},
            {type: 'checkbox', dbkey: 'I1', om: true},
            {type: 'select', dbkey: 'C', om: true},
            {type: 'plainimage', dbkey: 'I', om: true},
            {type: 'download', dbkey: 'I', om: true},
            {type: 'linkintern', dbkey: 'I', om: true},
            {type: 'tiny', dbkey: 'X2', om: true},
            {type: 'radio', dbkey: 'C', om: true},
            {type: 'image', dbkey: 'I', om: false},
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
      availFields.om[fields[key].type] = fields[key];
    }
    availFields.normal[fields[key].type] = fields[key];
  }

  return availFields;
}

function getFieldsMessage(mode) {
  var fieldInputMsg = '';
  var availFields = getFields();
  var availFieldTypes = {};

  if(typeof mode == 'undefined') {
    availFieldTypes = availFields.normal;
  } else if (typeof mode != 'undefined' && mode == 'om') {
    availFieldTypes = availFields.om;
  }

  var fieldsMsg = Object.keys(availFieldTypes).join(', ');

  fieldInputMsg +=  '--------------------------------------------------------------------------- \r\n';
  fieldInputMsg += 'Please enter the fields you want in "type:name[__r]" format comma-separated \r\n';
  fieldInputMsg += '(Fieldtypes: ' + fieldsMsg + ')' +'\r\n';
  fieldInputMsg += '--------------------------------------------------------------------------- \r\n';
  fieldInputMsg += 'EXAMPLE: input:heading__r,tiny:text,checkbox:displayicon,linkintern:bcID' + '\r\n';

  return fieldInputMsg;
}

function getForbiddenFields() {
  // return ['ADD','ALL','ALTER','ANALYZE','AND','AS','ASC','ASENSITIVE','BEFORE','BETWEEN','BIGINT','BINARY','BLOB','BOTH','BY','CALL','CASCADE','CASE','CHANGE','CHAR','CHARACTER','CHECK','COLLATE','COLUMN','CONDITION','CONSTRAINT','CONTINUE','CONVERT','CREATE','CROSS','CURRENT_DATE','CURRENT_TIME','CURRENT_TIMESTAMP','CURRENT_USER','CURSOR','DATABASE','DATABASES','DAY_HOUR','DAY_MICROSECOND','DAY_MINUTE','DAY_SECOND','DEC','DECIMAL','DECLARE','DEFAULT','DELAYED','DELETE','DESC','DESCRIBE','DETERMINISTIC','DISTINCT','DISTINCTROW','DIV','DOUBLE','DROP','DUAL','EACH','ELSE','ELSEIF','ENCLOSED','ESCAPED','EXISTS','EXIT','EXPLAIN','FALSE','FETCH','FLOAT','FLOAT4','FLOAT8','FOR','FORCE','FOREIGN','FROM','FULLTEXT','GRANT','GROUP','HAVING','HIGH_PRIORITY','HOUR_MICROSECOND','HOUR_MINUTE','HOUR_SECOND','IF','IGNORE','IN','INDEX','INFILE','INNER','INOUT','INSENSITIVE','INSERT','INT','INT1','INT2','INT3','INT4','INT8','INTEGER','INTERVAL','INTO','IS','ITERATE','JOIN','KEY','KEYS','KILL','LEADING','LEAVE','LEFT','LIKE','LIMIT','LINES','LOAD','LOCALTIME','LOCALTIMESTAMP','LOCK','LONG','LONGBLOB','LONGTEXT','LOOP','LOW_PRIORITY','MATCH','MEDIUMBLOB','MEDIUMINT','MEDIUMTEXT','MIDDLEINT','MINUTE_MICROSECOND','MINUTE_SECOND','MOD','MODIFIES','NATURAL','NOT','NO_WRITE_TO_BINLOG','NULL','NUMERIC','ON','OPTIMIZE','OPTION','OPTIONALLY','OR','ORDER','OUT','OUTER','OUTFILE','PRECISION','PRIMARY','PROCEDURE','PURGE','READ','READS','REAL','REFERENCES','REGEXP','RELEASE','RENAME','REPEAT','REPLACE','REQUIRE','RESTRICT','RETURN','REVOKE','RIGHT','RLIKE','SCHEMA','SCHEMAS','SECOND_MICROSECOND','SELECT','SENSITIVE','SEPARATOR','SET','SHOW','SMALLINT','SONAME','SPATIAL','SPECIFIC','SQL','SQLEXCEPTION','SQLSTATE','SQLWARNING','SQL_BIG_RESULT','SQL_CALC_FOUND_ROWS','SQL_SMALL_RESULT','SSL','STARTING','STRAIGHT_JOIN','TABLE','TERMINATED','THEN','TINYBLOB','TINYINT','TINYTEXT','TO','TRAILING','TRIGGER','TRUE','UNDO','UNION','UNIQUE','UNLOCK','UNSIGNED','UPDATE','USAGE','USE','USING','UTC_DATE','UTC_TIME','UTC_TIMESTAMP','VALUES','VARBINARY','VARCHAR','VARCHARACTER','VARYING','WHEN','WHERE','WHILE','WITH','WRITE','XOR','YEAR_MONTH','ZEROFILL'];
  return ['FILE','BLOB','CHECK','MATCH'];
}

