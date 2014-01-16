// Generated on 2014-01-16 using generator-c5block 0.0.7
'use strict';

module.exports = function (grunt) {
  // load all grunt tasks

  grunt.initConfig({
    version: {
      options: {
        release: 'patch'
      },
      c5pkg: {
        options: {
          prefix: '\\$pkgVersion\\s+=\\s+[\'"]'
        },
        src: ['controller.php']
      },
      pkg: 'package.json'
    },
    exec: {
      upgrade : {
        command: 'php cli/upgrade_cli.php',
      },
      install : {
        command: 'php cli/install_cli.php',
      }
    }

  });

  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('upgrade', ['version','exec:upgrade']);
  grunt.registerTask('install', ['exec:install']);

};
