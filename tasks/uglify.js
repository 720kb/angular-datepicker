/*global module*/
(function setUp(module) {
  'use strict';

  module.exports = function exportingFunction(banner, grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    return {
      'options': {
        'sourceMap': true,
        'sourceMapName': '<%= confs.dist %>/angular-datepicker.sourcemap.map',
        'preserveComments': false,
        'report': 'gzip',
        'banner': banner
      },
      'minifyTarget': {
        'files': {
          '<%= confs.dist %>/angular-datepicker.min.js': [
            '<%= confs.js %>/angular-datepicker.js'
          ]
        }
      }
    };
  };
}(module));
