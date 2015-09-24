/*global module*/
(function setUp(module) {
  'use strict';

  module.exports = function exportingFunction(banner, grunt) {

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    return {
      'options': {
        'report': 'gzip',
        'banner': banner
      },
      'minifyTarget': {
        'files': {
          '<%= confs.dist %>/angular-datepicker.min.css': [
            '<%= confs.css %>/angular-datepicker.css'
          ]
        }
      }
    };
  };
}(module));
