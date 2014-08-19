'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
          all: {
            files: {
                "css/style.out.css": "css/style.scss",
                "css/print.css": "css/print.scss"
            },
            options: {
                sourceComments: 'map',
                printError: true
            }
          }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'css/',
                src: [ '*.css', '!*.min.css'],
                dest: 'css/',
                ext: '.min.css'
            }
        },

        pot: {
            files: {
                src: ['**/*.php', '!node_modules/**', '!cli/**'],
                expand: true,
            },
            options: {
                text_domain: 'messages',
                dest: 'languages/<%%=pot.options.lang%>/LC_MESSAGES/messages.po',
                keywords: ['t'],
                overwrite: false,
                encoding: 'utf-8',
                lang: 'de_DE'
            }
        },

        concat: {
            options: {
                banner: '/*! !!! Diese Datei nicht editieren! Wird automatisch überschrieben !!! \n\n Concat <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy hh:MM:ss") %> */\n',
                process: function(src, filepath) {
                    return '\n\n//### ' + filepath + ' ### \n' + src;
                },
                separator: ';'
            },
            dist: {
              src: ['js/sb/responsiveImages.js', 'js/vendor/matchmedia.polyfill.min.js', 'js/vendor/**/*.js', 'js/sb/**/*.js'], // verhindert doppelte scripteinbindung automatisch
              dest: 'js/scripts.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! Uglify <%%= pkg.name %> <%%= grunt.template.today("dd-mm-yyyy hh:MM:ss") %> */\n',
                sourceMap: true
            },
            dist: {
              files: {
                  'js/scripts.min.js': ['<%%=concat.dist.dest %>']
              }
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'js/sb/**/*.js'],
            options : {
              globalstrict: true,
              globals : {
                jQuery: true,
                module: true,
                exports: true,
                '$': true,
                enquire: true,
                document: true,
                window: true
              }
            }
        },

        watch: {
            options: {
                spawn: false //no child processes
            },
            sass: {
                files: ['css/**/*.scss'],
                tasks: ['sass', 'cssmin']
            },
            scripts: {
                files: ['js/sb/**/*.js', 'js/vendor/**/*.js'],
                tasks: ['doScripts']
            }
            // css: { //this is just for live reload
            //   files: ['css/**/*.css'],
            //   tasks: [],
            //   options: {
            //     livereload: true
            //   }
            // }
        },

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
                    cwd: 'img/dummy/',
                    dest: 'img/resized/'
                }]
            }
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

    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-trimtrailingspaces');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-pot');

    grunt.registerTask('cleanlines', ['trimtrailingspaces', 'regex-replace:lines:remove']);

    var lang = grunt.option('lang') || 'de_DE';
    grunt.registerTask('langs', ['set_lang:' + lang, 'pot']);
    grunt.registerTask('set_lang', 'Set a config property.', function(lang) {
        grunt.config.set('pot.options.lang', lang);
    });
    grunt.registerTask('doScripts', ['concat', 'uglify']);

};
