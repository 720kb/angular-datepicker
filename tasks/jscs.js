/*global module*/
(function setUp(module) {
  'use strict';

  module.exports = function exportingFunction(grunt) {

    grunt.loadNpmTasks('grunt-jscs');
    return {
      'src': '<%= confs.js %>/**/*.js',
      'options': {
        'config': '.jscsrc'
      }
    };
  };
}(module));
