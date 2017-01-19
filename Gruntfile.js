/*global module, require*/
(function setUp(module, require) {
  'use strict';

  var banner = ['/*!',
      ' * Angular Datepicker v<%= pkg.version %>',
      ' *',
      ' * Released by 720kb.net under the MIT license',
      ' * www.opensource.org/licenses/MIT',
      ' *',
      ' * <%= grunt.template.today("yyyy-mm-dd") %>',
      ' */\n\n'].join('\n');

  module.exports = function doGrunt(grunt) {
    var confs = require('./tasks/confs')
      , jscs = require('./tasks/jscs')(grunt)
      , csslint = require('./tasks/csslint')(grunt)
      , eslint = require('./tasks/eslint')(grunt)
      , uglify = require('./tasks/uglify')(banner, grunt)
      , cssmin = require('./tasks/cssmin')(banner, grunt)
      , connect = require('./tasks/connect')(grunt)
      , watch = require('./tasks/watch')(grunt)
      , concurrent = require('./tasks/concurrent')(grunt)
      , copy = require('./tasks/copy')(grunt);

    grunt.initConfig({
      'pkg': grunt.file.readJSON('package.json'),
      'confs': confs,
      'jscs': jscs,
      'csslint': csslint,
      'eslint': eslint,
      'uglify': uglify,
      'cssmin': cssmin,
      'connect': connect,
      'watch': watch,
      'concurrent': concurrent,
	  'copy': copy
    });

    grunt.registerTask('default', [
      'lint',
      'concurrent:dev'
    ]);

    grunt.registerTask('lint', [
      'csslint',
      'eslint',
      'jscs'
    ]);

    grunt.registerTask('prod', [
      'lint',
	  'copy:non-minified',
      'cssmin',
      'uglify'
    ]);
  };
}(module, require));
