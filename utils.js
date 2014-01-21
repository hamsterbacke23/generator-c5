'use strict';
var path = require('path');
var fs = require('fs');

module.exports = {
  getHandle: getHandle
}

function getHandle (self, namespace) {
  var namespace = typeof namespace == 'undefined' ? '' : namespace.trim() + '_';
  console.log('namespace ' + namespace);
  return self._.underscored(
    namespace + self._.slugify(self.name.toLowerCase()).trim()
  );
};
