/*global module, require*/
(function setUp(module, require) {
  'use strict';

  var modRewrite = require('connect-modrewrite');

  module.exports = function exportingFunction(grunt) {

    grunt.loadNpmTasks('grunt-contrib-connect');
    return {
      'server': {
        'options': {
          'port': '<%= confs.serverPort %>',
          'base': '.',
          'keepalive': true,
          'middleware': function manageMiddlewares(connect, options, middlewares) {
            // enable Angular's HTML5 mode
            middlewares.push(modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.gif$ /index.html [L]']));
            return middlewares;
          }
        }
      }
    };
  };
}(module, require));
