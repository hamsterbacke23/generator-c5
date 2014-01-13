// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  // require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.loadNpmTasks('grunt-line-remover');
  grunt.loadNpmTasks('grunt-http');

  grunt.initConfig({
    lineremover: {
      customExclude: {
        files: {
           '<%=blockrelpath%>form.php':  '<%=blockrelpath%>form.php',
           '<%=blockrelpath%>view.php':  '<%=blockrelpath%>view.php',
           '<%=blockrelpath%>db.xml':  '<%=blockrelpath%>db.xml',
           '<%=blockrelpath%>controller.php':  '<%=blockrelpath%>controller.php'
        },
        options: {
          exclusionPattern: /^\s*\r{2}/g
        }
      },
    },
    http: {
      your_service: {
        options: {
          url: 'your/url.com',
        },
        dest: 'optional/file/to/save/response'
      }
    }
  });

  grunt.registerTask('default', ['lineremover']);

};


