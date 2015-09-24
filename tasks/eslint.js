/*global module*/
(function setUp(module) {
  'use strict';

  module.exports = function exportingFunction(grunt) {

    grunt.loadNpmTasks('grunt-eslint');
    return {
      'options': {
        'config': '.eslintrc'
      },
      'target': [
        'Gruntfile.js',
        '<%= confs.js %>/**/*.js'
      ]
    };
  };
}(module));
