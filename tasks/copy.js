/*global module, require*/
(function setUp(module, require) {
  'use strict';

  module.exports = function exportingFunction(grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    return {
      'non-minified': {
        'files': [
          { expand: true, flatten: true, src: ['<%= confs.css %>/**/*.css'], dest: '<%= confs.dist %>/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['<%= confs.js %>/**/*.js'], dest: '<%= confs.dist %>/', filter: 'isFile' },
        ]
      }
    };
  };
}(module, require));
