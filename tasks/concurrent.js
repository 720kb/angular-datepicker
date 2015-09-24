/*global module*/
(function setUp(module) {
  'use strict';

  module.exports = function exportingFunction(grunt) {

    grunt.loadNpmTasks('grunt-concurrent');
    return {
      'dev': {
        'tasks': [
          'connect:server',
          'watch:dev'
        ],
        'options': {
          'limit': '<%= concurrent.dev.tasks.length %>',
          'logConcurrentOutput': true
        }
      }
    };
  };
}(module));
