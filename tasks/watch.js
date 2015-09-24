/*global module*/
(function setUp(module) {
  'use strict';

  module.exports = function exportingFunction(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    return {
      'dev': {
        'files': [
          'Gruntfile.js',
          '<%= confs.css %>/**/*.css',
          '<%= confs.js %>/**/*.js'
        ],
        'tasks': [
          'csslint',
          'eslint'
        ],
        'options': {
          'spawn': false
        }
      }
    };
  };
}(module));
