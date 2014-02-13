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
      },
      createlangs : {
        command: function(lang) {
          return "find ./ -iname '*.php' -exec xgettext --default-domain=messages --from-code=utf-8 --keyword=t --language=PHP -p ./languages/"+lang+"/LC_MESSAGES/ -j {} \\;";
        },
        stdout: false,
        stderr: false
      }
    },
    clean: {
      build: ['index_cli.php', 'cli', 'package.json', 'Gruntfile.js', 'readme.md', 'node_modules', 'composer.json', 'cs']
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
    },
    trimtrailingspaces: {
      main: {
        src: ['**/*.php'],
        options: {
          filter: 'isFile',
          encoding: 'utf8',
          failIfTrimmed: false
        }
      }
    },
    phpcs: {
      application: {
        dir: ['**/*.php']
      },
      options: {
        bin: 'vendor/bin/phpcs',
        standard: 'Zend'
      }
    },
    watch: {
      scripts: {
        files: ['**/*.php'],
        tasks: ['phpcs'],
        options: {
          spawn: false,
        },
      },
    }



  });

  grunt.loadNpmTasks('grunt-trimtrailingspaces');
  grunt.loadNpmTasks('grunt-regex-replace');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-phpcs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var lang = grunt.option('lang') || 'de_DE';
  var vt = grunt.option('vt') || 'patch';

  grunt.registerTask('langs', ['exec:createlangs:' + lang]);
  grunt.registerTask('cleanlines', ['trimtrailingspaces', 'regex-replace:lines:remove']);
  grunt.registerTask('upgrade', ['set_vt:' + vt, 'version','exec:upgrade']);
  grunt.registerTask('build', ['set_vt:' + vt, 'version','exec:upgrade','clean:build']);
  grunt.registerTask('install', ['exec:install']);
  grunt.registerTask('uninstall', ['exec:uninstall']);
  grunt.registerTask('set_vt', 'Set a config property.', function(vt) {
    grunt.config.set('version.options.type', vt);
  });

};
