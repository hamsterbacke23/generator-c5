'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    themePath: '<%%=pkg.themePath%>',

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

    sass: {
      klickmodell: {
        files: {
          "css/style.out.css": "css/style.scss",
          "css/print.css": "css/print.scss"
        },
        options: {
          sourceComments: 'map',
          printError: true
        }
      },
      production: {
        files: {
          "css/style.out.css": "css/style.scss",
          "css/print.css": "css/print.scss"
        },
        options: {
          outputStyle: 'compressed' //not working right now as of 3/14
        }
      },
    },

    pot: {
      concrete5: {
        options: {
          text_domain: 'messages',
          dest: 'languages/<%=pot.options.lang%>/LC_MESSAGES/messages.po',
          keywords: ['t'],
          overwrite: false,
          encoding: 'utf-8',
          lang: 'de_DE'
        },
        files: {
          src: ['**/*.php', '!node_modules/**', '!cli/**'],
          expand: true,
        }
      }
    },
    <% }//endif pot %>

    <% if(responsive_images) {%>
    responsive_images: {
      normal: {
        options: {
          // Needs: Graphicsmagick
          sizes: [{
            width: 320,
          }, {
            width: 480,
          }, {
            width: 640,
          }, {
            width: 768,
          }, {
            width: 1024,
          }]
        },
        files: [{
          expand: true,
          src: ['**.{jpg,gif,png}'],
          cwd: '<%%=pkg.themePath%>img/dummy/',
          dest: '<%%=pkg.themePath%>img/resized/'
        }]
      }
    },
    <% }//endif responsive images %>

    concat: {
      options: {
        banner: '/*! !!! Diese Datei nicht editieren! Wird automatisch überschrieben !!! \n\n Concat <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy hh:MM:ss") %> */\n',
        process: function(src, filepath) {
          return '\n\n//### ' + filepath + ' ### \n' + src;
        },
        separator: ';'
      },
      klickmodell: {
        src: [
        '<%%=pkg.themePath%>js/sb/responsiveImages.js',
        '<%%=pkg.themePath%>js/vendor/matchmedia.polyfill.min.js',
        '<%%=pkg.themePath%>js/vendor/**/*.js',
        '<%%=pkg.themePath%>js/sb/**/*.js'
        ],
        dest: themePath + '<%%=pkg.themePath%>js/scripts.js'
      },
    },

    uglify: {
      options: {
        banner: '/*! Uglify <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy hh:MM:ss") %> */\n',
        sourceMap: true
      },
      klickmodell: {
        files: {
          '<%%=pkg.themePath%>js/scripts.min.js': ['<%= concat.klickmodell.dest %>']
        }
      }
    },

    watch: {
      options: {
        spawn: false //no child processes
      },
      sass: {
        files: ['<%%=pkg.themePath%>css/**/*.scss'],
        tasks: ['sass:<%%=pkg.env%>']
      },
      scripts: {
        files: ['<%%=pkg.themePath%>js/sb/**/*.js', '<%%=pkg.themePath%>js/vendor/**/*.js'],
        tasks: ['doScripts']
      }
      // css: { //this is just for live reload
      //   files: ['css/**/*.css'],
      //   tasks: [],
      //   options: {
      //     livereload: true
      //   }
      // }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  <% if(responsive_images){ %>
  grunt.loadNpmTasks('grunt-responsive-images');
  <% } //endif responsive_images %>
  grunt.loadNpmTasks('grunt-contrib-watch');
  <% if(sass){ %>
  grunt.loadNpmTasks('grunt-sass');
  <% } //endif sass %>
  <% if(pot){ %>
  grunt.loadNpmTasks('grunt-pot');
  <% } //endif pot %>

  <% if(pot){ %>
  var lang = grunt.option('lang') || 'de_DE';
  grunt.registerTask('langs', ['set_lang:' + lang, 'pot']);
  grunt.registerTask('set_lang', 'Set a config property.', function(lang) {
    grunt.config.set('pot.options.lang', lang);
  });
  <% } //endif pot %>

  grunt.registerTask('doScripts', ['concat', 'uglify']);

  <% if(bower){ %>
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.registerTask('assets', ['bower-install']);
  <% } //endif bower %>

}; //module
