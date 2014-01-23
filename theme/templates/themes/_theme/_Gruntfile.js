'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    'bower-install': {
      target: {
        src: ['inc/html_start.php'],

        cwd: '',
        ignorePath: '',
        exclude: [],
        fileTypes: {
          html: {
            block: /(([\s\t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
            detect: {
              js: /<script.*src=['"](.+)['"]>/gi,
              css: /<link.*href=['"](.+)['"]/gi
            },
            replace: {
              js: '<script src="{{filePath}}"></script>',
              css: '<link rel="stylesheet" href="{{filePath}}" />'
            }
          }, php: {
            block: /(([\s\t]*)<\?php\s*\/\/\s*<!--\s*bower:*(\S*)\s*-->\s*\?>)(\n|\r|.)*?(<\?php\s*\/\/\s*<!--\s*endbower\s*-->\s*\?>)/gi,
            detect: {
              js: /<script.*src=['"](.+)['"]>/gi,
              css: /<link.*href=['"](.+)['"]/gi
            },
            replace: {
              js: '<script src="{{filePath}}"></script>',
              css: '<link rel="stylesheet" href="{{filePath}}" />'
            }
          }
        }
      }
    },
    less: {
      development: {
        files: {
          "css/style.css": "css/style.less"
        }
      },
      production: {
        files: {
          "css/style.css": "css/style.less"
        },
        cleancss: true
      },
    },
    sass: {
      development: {
        files: {
          "css/style.css": "css/style.scss"
        },
        sourceComments: 'map'
      },
      production: {
        files: {
          "css/style.css": "css/style.scss"
        },
        outputStyle : 'compressed'
      },
    },
    <% if(prepros) {%>
    watch: {
      scripts: {
        files: ['css/<%=prepros%>/**'],
        tasks: ['<%=prepros%>:development'],
        options: {
          spawn: false,
        },
      },
    }
  <% }%>
  });

  grunt.loadNpmTasks('grunt-bower-install');

  <% if(prepros) {%>
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-<%=prepros%>');
  <% }%>
  grunt.registerTask('assets', ['bower-install']);
};
