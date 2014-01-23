'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    version: {
      options: {
        release: '<%%=version.options.type%>',
        type: 'patch'
      },
      c5pkg: {
        options: {
          prefix: '\\$pkgVersion\\s+=\\s+[\'"]'
        },
        src: ['controller.php']
      },
      pkg: 'package.json',
    },
    exec: {
      upgrade : {
        command: 'php cli/upgrade_cli.php',
      },
      install : {
        command: 'php cli/install_cli.php',
      },
      uninstall : {
        command: 'php cli/uninstall_cli.php',
      }
    },
    clean: {
      build: ['index_cli.php', 'cli', 'package.json', 'Gruntfile.js', 'readme.md', 'node_modules']
    },
    'regex-replace': {
      lines: { //specify a target with any name
        src: ['**/*.php'],
        actions: [
          {
            name: 'remove',
            search: '(\s*\n){2,}',
            replace: '\n\n',
            flags: 'g'
          }
        ]
      }
    }


  });

  grunt.loadNpmTasks('grunt-regex-replace');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('cleanlines', ['regex-replace:lines:remove']);
  grunt.registerTask('upgrade', ['version','exec:upgrade']);
  grunt.registerTask('build', ['set_vtype:major', 'version','exec:upgrade','clean:build']);
  grunt.registerTask('install', ['exec:install']);
  grunt.registerTask('uninstall', ['exec:uninstall']);
  grunt.registerTask('set_vtype', 'Set a config property.', function(val) {
    grunt.config.set('version.options.type', val);
  });

};
