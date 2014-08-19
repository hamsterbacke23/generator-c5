'use strict';
var path = require('path');
var fs = require('fs');

module.exports = {
  getHandle: getHandle,
  processDirectory : processDirectory
};

function getHandle (self, namespace) {
  namespace = typeof namespace == 'undefined' ? '' : namespace.trim() + '_';
  return self._.underscored(
    namespace + self._.slugify(self.name.toLowerCase()).trim()
  );
}

//thx to http://stackoverflow.com/questions/20139196/how-do-i-process-multiple-files-as-templates-with-yeoman-generator
function processDirectory (source, destination) {
  var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
  var files = this.expandFiles('**', { dot: true, cwd: root });

  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var src = path.join(root, f);

    if(path.basename(f).indexOf('_') == 0) {
      var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
      this.template(src, dest);
    } else {
      var dest = path.join(destination, f);
      this.copy(src, dest);
    }
  }
}
