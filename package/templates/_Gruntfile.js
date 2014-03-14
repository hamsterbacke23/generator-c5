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
    <%% if(pkgcli){%>
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
    <%% }%>
    pot: {
      options:{
        text_domain: 'messages',
        dest: 'languages/<%%=pot.options.lang%>/LC_MESSAGES/messages.po',
        keywords: ['t'],
        overwrite: false,
        encoding: 'utf-8',
        lang : 'de_DE'
      },
      files:{
        src:  ['**/*.php','!node_modules/**','!cli/**'],
        expand: true,
      }
    },
    clean: {
      build: ['cli', 'package.json', 'generator-c5.json', 'Gruntfile.js', 'readme.md', 'node_modules', 'composer.json', 'cs']
    },
    'regex-replace': {
      lines: { //specify a target with any name
        src: ['**/*.php','!node_modules/**','!cli/**'],
        actions: [
          {
            name: 'remove',
            search: '(\s*\\n){2,}',
            replace: '\n\n',
            flags: 'g'
          }
        ]
      }
    },
    trimtrailingspaces: {
      main: {
        src: ['**/*.php','!node_modules/**','!cli/**'],
        options: {
          filter: 'isFile',
          encoding: 'utf8',
          failIfTrimmed: false
        }
      }
    },
    phpcs: {
      application: {
        dir: ['**/*.php','!node_modules/**','!cli/**'],
      },
      options: {
        bin: 'vendor/bin/phpcs',
        standard: 'Zend'
      }
    },
    watch: {
      scripts: {
        files: ['**/*.php','!node_modules/**','!cli/**'],
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
  grunt.loadNpmTasks('grunt-pot');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var lang = grunt.option('lang') || 'de_DE';
  var vt = grunt.option('vt') || 'patch';

  grunt.registerTask('cleanlines', ['trimtrailingspaces', 'regex-replace:lines:remove']);
  grunt.registerTask('upgrade', ['set_vt:' + vt, 'version','exec:upgrade']);
  grunt.registerTask('build', ['set_vt:' + vt, 'version','exec:upgrade','clean:build']);
  grunt.registerTask('uninstall', ['exec:uninstall']);
  grunt.registerTask('langs', ['set_lang:' + lang,'pot']);
  grunt.registerTask('set_vt', 'Set a config property.', function(vt) {
    grunt.config.set('version.options.type', vt);
  });
  grunt.registerTask('set_lang', 'Set a config property.', function(lang) {
    grunt.config.set('pot.options.lang', lang);
  });

};
