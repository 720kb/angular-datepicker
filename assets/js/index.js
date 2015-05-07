/*global angular*/

(function (angular) {
  'use strict';

  var app = angular.module('720kb', [
    'ngRoute',
    '720kb.datepicker'
  ]);
  
  // Setup interpolation to use [[ / ]]
  app.config(function($interpolateProvider) {
        // Setup angular to use [[ expression ]] instead of {{ expression }}
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
  });
}(angular));
