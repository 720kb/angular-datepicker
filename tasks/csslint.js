/*global module*/
(function setUp(module) {
  'use strict';

  module.exports = function exportingFunction(grunt) {

    grunt.loadNpmTasks('grunt-contrib-csslint');
    return {
     'options': {
       'csslintrc': '.csslintrc'
     },
     'strict': {
       'src': [
         '<%= confs.css %>/**/*.css'
       ]
     }
   };
  };
}(module));
